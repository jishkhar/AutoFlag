document.addEventListener('DOMContentLoaded', () => {
    const benchmarkSelect = document.getElementById('benchmarkSelect');
    const form = document.getElementById('optimizationForm');
    const runBtn = document.getElementById('runBtn');
    const resultsPanel = document.getElementById('resultsPanel');
    const statusBadge = document.getElementById('statusBadge');
    const loadingState = document.getElementById('loadingState');
    const resultsContent = document.getElementById('resultsContent');
    const terminalOutput = document.getElementById('terminalOutput');
    const outputContent = document.getElementById('outputContent');
    const errorState = document.getElementById('errorState');
    const errorMessage = errorState.querySelector('.error-message');

    // Fetch benchmarks on load
    fetch('/benchmarks')
        .then(response => response.json())
        .then(data => {
            benchmarkSelect.innerHTML = '<option value="" disabled selected>Select a benchmark</option>';
            data.benchmarks.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                benchmarkSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Failed to load benchmarks:', err);
            benchmarkSelect.innerHTML = '<option value="" disabled>Error loading benchmarks</option>';
        });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const benchmark = benchmarkSelect.value;
        const optimizer = document.querySelector('input[name="optimizer"]:checked').value;

        if (!benchmark || !optimizer) return;

        // UI Reset
        runBtn.disabled = true;
        runBtn.textContent = 'Processing...';
        resultsPanel.style.display = 'block';
        loadingState.style.display = 'block';
        resultsContent.innerHTML = '';
        terminalOutput.style.display = 'none'; // Hide terminal initially until data comes
        outputContent.textContent = '';
        errorState.style.display = 'none';
        updateStatus('running');

        // Scroll to results
        resultsPanel.scrollIntoView({ behavior: 'smooth' });

        try {
            // Fetch file content
            const fileResponse = await fetch(`/benchmarks/${benchmark}`);
            if (!fileResponse.ok) throw new Error('Failed to fetch benchmark file');
            const blob = await fileResponse.blob();
            const file = new File([blob], benchmark, { type: 'text/plain' });

            const formData = new FormData();
            formData.append('source_file', file);

            // Determine endpoint
            let endpoint = '';
            if (optimizer === 'compare') {
                endpoint = '/optimize/compare';
            } else {
                endpoint = `/optimize/${optimizer}`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Optimization failed to start');
            }

            const job = await response.json();

            // Show terminal once job starts
            terminalOutput.style.display = 'block';
            startStreaming(job.job_id);
            pollJobStatus(job.job_id);

        } catch (err) {
            showError(err.message);
            resetBtn();
        }
    });

    function resetBtn() {
        runBtn.disabled = false;
        runBtn.textContent = '[ EXECUTE OPTIMIZATION ]';
    }

    async function pollJobStatus(jobId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/jobs/${jobId}`);
                const job = await response.json();

                if (job.status === 'completed') {
                    clearInterval(pollInterval);
                    updateStatus('completed');
                    loadingState.style.display = 'none';
                    showResults(job);
                    resetBtn();
                } else if (job.status === 'failed') {
                    clearInterval(pollInterval);
                    updateStatus('failed');
                    loadingState.style.display = 'none';
                    showError(job.error || 'Optimization failed');
                    resetBtn();
                }
            } catch (err) {
                clearInterval(pollInterval);
                showError('Failed to poll job status');
                resetBtn();
            }
        }, 2000);
    }

    function startStreaming(jobId) {
        const eventSource = new EventSource(`/jobs/${jobId}/stream`);

        eventSource.onmessage = (event) => {
            outputContent.textContent += event.data + '\n';
            // Auto-scroll
            const pre = document.querySelector('.terminal-output pre');
            if (pre) pre.scrollTop = pre.scrollHeight;
        };

        eventSource.addEventListener('close', () => {
            eventSource.close();
        });

        eventSource.onerror = (err) => {
            eventSource.close();
        };
    }

    function updateStatus(status) {
        statusBadge.className = `badge badge-${status}`;
        statusBadge.textContent = status.toUpperCase();
    }

    function showError(msg) {
        errorState.style.display = 'block';
        errorMessage.textContent = `ERROR: ${msg}`;
        loadingState.style.display = 'none';
    }

    function showResults(job) {
        let html = '';

        if (job.result) {
            // Format generic results
            if (job.result.best_time !== undefined) {
                 html += `
                    <div class="result-item">
                        <div class="result-label">BEST EXECUTION TIME</div>
                        <div class="result-value">${job.result.best_time.toFixed(6)} s</div>
                    </div>
                `;
            }
            if (job.result.total_time !== undefined) {
                 html += `
                    <div class="result-item">
                        <div class="result-label">OPTIMIZATION TIME</div>
                        <div class="result-value">${job.result.total_time.toFixed(2)} s</div>
                    </div>
                `;
            }
            if (job.result.evaluations !== undefined) {
                 html += `
                    <div class="result-item">
                        <div class="result-label">TOTAL EVALUATIONS</div>
                        <div class="result-value">${job.result.evaluations}</div>
                    </div>
                `;
            }

            if (job.result.enabled_flags && job.result.enabled_flags.length > 0) {
                html += `
                    <div class="result-item" style="display:block">
                        <div class="result-label" style="margin-bottom:0.5rem">ENABLED FLAGS</div>
                        <div class="result-value" style="font-size:0.8rem; color: #fff;">${job.result.enabled_flags.join(' ')}</div>
                    </div>
                `;
            }
        }

        // Handle generic JSON dump for comparisons if structure differs
        if (job.optimizer === 'compare_optimizers' && job.result) {
             html += `
                <div class="result-item" style="display:block">
                    <pre style="background:transparent; padding:0; color:var(--primary);">${JSON.stringify(job.result, null, 2)}</pre>
                </div>
            `;
        }

        resultsContent.innerHTML = html;

        if (job.output) {
            // Ensure final output is synced
            outputContent.textContent = job.output;
        }
    }
});