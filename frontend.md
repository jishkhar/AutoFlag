# Frontend Specification Document
## Compiler Optimization Tool - UI/UX Design

**Project:** Compiler Flag Optimization System  
**Version:** 1.0.0  
**Date:** December 3, 2025  
**API Base URL:** `http://localhost:8000`

---

## Table of Contents

1. [Overview](#overview)
2. [User Flows](#user-flows)
3. [Page Structure](#page-structure)
4. [Component Specifications](#component-specifications)
5. [API Integration](#api-integration)
6. [State Management](#state-management)
7. [Design System](#design-system)
8. [Wireframes & Layouts](#wireframes--layouts)

---

## 1. Overview

### Purpose
A web-based interface for compiler flag optimization tools that allows users to upload C/C++ source files and run various optimization algorithms (FOGA, HBRF, XGBoost) to find the best compiler flags for optimal execution performance.

### Key Features
- Upload C/C++ source files with optional test input
- Run four different optimization strategies:
  - **FOGA** (Flag Optimization with Genetic Algorithm)
  - **HBRF** (Hybrid Bayesian-Random Forest)
  - **XGBoost** (Gradient Boosting Optimizer)
  - **Compare** (Run all optimizers and compare results)
- Real-time job monitoring and progress tracking
- Visual comparison of results with charts
- Download optimized binaries and detailed reports
- Job history and management

### Target Users
- Compiler engineers
- Performance optimization researchers
- Software developers seeking optimal compilation flags
- Students studying compiler optimization

---

## 2. User Flows

### Flow 1: Single Optimizer Execution

```
1. User lands on Home Page
2. User selects optimizer type (FOGA/HBRF/XGBoost/Compare)
3. User uploads source file (.c or .cpp)
4. (Optional) User uploads test input file
5. User clicks "Start Optimization"
6. System creates job and redirects to Job Status Page
7. User sees real-time progress updates
8. On completion, user views results
9. User downloads optimized binary or results JSON
```

### Flow 2: Comparison Mode

```
1. User selects "Compare All Optimizers"
2. User uploads source file and optional test input
3. User clicks "Start Comparison"
4. System runs all three optimizers sequentially
5. User sees progress for each optimizer phase
6. System generates comparison report with:
   - Execution time comparison
   - Optimization time analysis
   - Winner declaration
   - Visual charts
7. User reviews comprehensive comparison
8. User exports comparison report
```

### Flow 3: Job Management

```
1. User navigates to Jobs Dashboard
2. User sees list of all jobs (active and completed)
3. User filters by status or optimizer type
4. User clicks on job to view details
5. User can:
   - View real-time progress (for running jobs)
   - Download results (for completed jobs)
   - Delete jobs
   - Restart failed jobs
```

---

## 3. Page Structure

### 3.1 Main Navigation Layout

```
┌─────────────────────────────────────────────────────────┐
│  🚀 Compiler Optimizer     [Home] [Jobs] [Docs] [About] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  [Page Content Area]                    │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
│  Footer: Version 1.0.0 | API Health: ● Online         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Pages

1. **Home Page** - Optimizer selection and file upload
2. **Job Status Page** - Real-time job monitoring
3. **Results Page** - Detailed optimization results
4. **Comparison Page** - Multi-optimizer comparison view
5. **Jobs Dashboard** - Job history and management
6. **Documentation Page** - Help and API documentation

---

## 4. Component Specifications

### 4.1 Home Page Components

#### Component: Header
**Location:** Top of every page  
**Elements:**
- Logo/Title: "🚀 Compiler Optimizer"
- Navigation menu: Home | Jobs | Documentation | About
- API Status indicator (green dot = healthy)
- Dark/Light mode toggle

**API Integration:**
- `GET /health` - Check API status every 30 seconds
- Display connection status

---

#### Component: Optimizer Selection Card
**Location:** Home page center  
**Functionality:** Allow user to select optimization strategy

**Layout:**
```
┌────────────────────────────────────────────────┐
│  Select Optimization Strategy                 │
├────────────────────────────────────────────────┤
│                                                │
│  [🧬 FOGA]      [🔬 HBRF]      [⚡ XGBoost]   │
│   Genetic        Bayesian        Gradient      │
│   Algorithm      + RF            Boosting      │
│                                                │
│           [📊 Compare All]                     │
│            Run all & compare                   │
└────────────────────────────────────────────────┘
```

**Elements:**
- Four clickable cards (3 individual optimizers + 1 compare mode)
- Each card shows:
  - Icon/emoji
  - Optimizer name
  - Brief description (1-2 lines)
  - Estimated time indicator
  - "Select" button

**Card Details:**

1. **FOGA Card**
   - Icon: 🧬
   - Title: "FOGA"
   - Description: "Genetic Algorithm-based optimization"
   - Details: 
     - Population: 277
     - Generations: 10
     - Time: ~15-30 minutes
   - Color theme: Blue gradient

2. **HBRF Card**
   - Icon: 🔬
   - Title: "HBRF"
   - Description: "Hybrid Bayesian-Random Forest"
   - Details:
     - Random sampling: 100 configs
     - Bayesian iterations: 50
     - Time: ~20-40 minutes
   - Color theme: Green gradient

3. **XGBoost Card**
   - Icon: ⚡
   - Title: "XGBoost"
   - Description: "Gradient Boosting optimization"
   - Details:
     - Initial samples: 100
     - Refinement: 50 iterations
     - Time: ~10-25 minutes
   - Color theme: Orange gradient

4. **Compare All Card**
   - Icon: 📊
   - Title: "Compare All"
   - Description: "Run all optimizers and compare"
   - Details:
     - Runs: All 3 optimizers
     - Includes: Baseline benchmarks
     - Time: ~45-90 minutes
   - Color theme: Purple gradient

**Interactions:**
- Hover: Card elevation/shadow increases
- Click: Card selected (highlighted border)
- Selected state persists until form submission

---

#### Component: File Upload Section
**Location:** Below optimizer selection  
**Functionality:** Upload source file and optional test input

**Layout:**
```
┌────────────────────────────────────────────────┐
│  Upload Files                                  │
├────────────────────────────────────────────────┤
│                                                │
│  Source File (Required) *                      │
│  ┌──────────────────────────────────────────┐ │
│  │ [📄 Drop .c or .cpp file here]           │ │
│  │        or click to browse                 │ │
│  └──────────────────────────────────────────┘ │
│  Accepted: .c, .cpp                            │
│                                                │
│  Test Input (Optional)                         │
│  ┌──────────────────────────────────────────┐ │
│  │ [📝 Drop input file here]                │ │
│  │        or click to browse                 │ │
│  └──────────────────────────────────────────┘ │
│  Accepted: .txt, .in                           │
│                                                │
│  Uploaded Files:                               │
│  ✓ matrix_multiply.c (2.3 KB) [✗ Remove]     │
│  ✓ test_input.txt (0.5 KB) [✗ Remove]        │
│                                                │
│            [🚀 Start Optimization]             │
└────────────────────────────────────────────────┘
```

**Elements:**

1. **Source File Dropzone**
   - Drag-and-drop area
   - File type validation (.c, .cpp)
   - File size limit: 10 MB
   - Visual feedback on drag-over
   - Error message for invalid files

2. **Test Input Dropzone**
   - Optional upload
   - Accepts any text file
   - File size limit: 5 MB
   - Can be skipped

3. **File List**
   - Shows uploaded files with:
     - File name
     - File size
     - Remove button
   - Validation indicator (✓ or ✗)

4. **Start Button**
   - Disabled until:
     - Optimizer selected
     - Valid source file uploaded
   - Shows loading spinner on click
   - Displays error messages inline

**Validation Rules:**
- Source file is required
- Source file must be .c or .cpp
- File size must not exceed limits
- Files must pass basic syntax validation (client-side check)

**API Integration:**
- `POST /optimize/foga` (if FOGA selected)
- `POST /optimize/hbrf` (if HBRF selected)
- `POST /optimize/xgboost` (if XGBoost selected)
- `POST /optimize/compare` (if Compare selected)

**Request Format:**
```
FormData {
  source_file: File
  test_input_file: File (optional)
}
```

**Response Handling:**
```json
{
  "job_id": "uuid-string",
  "status": "pending",
  "message": "Job created successfully"
}
```
→ Redirect to Job Status Page with job_id

---

#### Component: Quick Info Panel
**Location:** Sidebar or below upload section  
**Purpose:** Educational information about optimizations

**Content:**
```
┌────────────────────────────────────────┐
│  ℹ️ What are compiler flags?          │
├────────────────────────────────────────┤
│  Compiler flags control how your code  │
│  is optimized. This tool searches      │
│  through 70+ GCC flags to find the     │
│  best combination for your program.    │
│                                        │
│  📊 Optimization Levels:               │
│  • -O1: Basic optimizations           │
│  • -O2: Moderate optimizations        │
│  • -O3: Aggressive optimizations      │
│  • Custom: AI-selected flags          │
│                                        │
│  [Learn More] [View Examples]         │
└────────────────────────────────────────┘
```

---

### 4.2 Job Status Page Components

#### Component: Job Header
**Location:** Top of job status page  
**Layout:**
```
┌────────────────────────────────────────────────┐
│  ← Back to Home                                │
│                                                │
│  Job ID: 123e4567-e89b-12d3-a456-426614174000 │
│  Optimizer: FOGA (Genetic Algorithm)           │
│  Source: matrix_multiply.c                     │
│  Status: [●] Running                           │
│  Created: 2025-12-03 14:23:15                  │
│  Duration: 00:05:42                            │
└────────────────────────────────────────────────┘
```

**Elements:**
- Back navigation button
- Job ID (with copy button)
- Optimizer type with icon
- Source file name
- Status badge (color-coded)
- Timestamps
- Real-time duration counter

**Status Badge Colors:**
- 🟡 Pending (Yellow)
- 🔵 Running (Blue, animated pulse)
- 🟢 Completed (Green)
- 🔴 Failed (Red)

---

#### Component: Progress Tracker
**Location:** Main content area of job status page  
**Purpose:** Show real-time optimization progress

**Layout for FOGA:**
```
┌────────────────────────────────────────────────┐
│  Optimization Progress                         │
├────────────────────────────────────────────────┤
│                                                │
│  ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱ 65%              │
│                                                │
│  Current Generation: 7 / 10                    │
│  Evaluations: 1,862                            │
│  Best Time: 0.003245s                          │
│  Average Time: 0.004521s                       │
│                                                │
│  Recent Activity:                              │
│  [14:28:42] Gen 7 complete - Best: 0.003245s  │
│  [14:28:35] Gen 6 complete - Best: 0.003512s  │
│  [14:28:28] Gen 5 complete - Best: 0.003898s  │
│  [14:28:21] Gen 4 complete - Best: 0.004123s  │
│                                                │
└────────────────────────────────────────────────┘
```

**Layout for HBRF (4 phases):**
```
┌────────────────────────────────────────────────┐
│  Optimization Progress                         │
├────────────────────────────────────────────────┤
│                                                │
│  [✓] Phase 1: Random Sampling                 │
│      100/100 samples collected                 │
│                                                │
│  [✓] Phase 2: Feature Importance              │
│      Top 20 flags identified                   │
│                                                │
│  [→] Phase 3: Bayesian Optimization           │
│      ▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱ 32/50 iterations         │
│                                                │
│  [ ] Phase 4: Greedy Refinement               │
│      Waiting...                                │
│                                                │
│  Best Time: 0.002891s                          │
│  Total Evaluations: 132                        │
│                                                │
└────────────────────────────────────────────────┘
```

**Layout for Compare Mode:**
```
┌────────────────────────────────────────────────┐
│  Comparison Progress                           │
├────────────────────────────────────────────────┤
│                                                │
│  [✓] Baseline Benchmarks (-O1, -O2, -O3)      │
│      -O3: 0.005123s                            │
│                                                │
│  [→] FOGA Optimizer                            │
│      ▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱ Gen 6/10               │
│      Current Best: 0.004892s                   │
│                                                │
│  [⏳] HBRF Optimizer                           │
│      Waiting to start...                       │
│                                                │
│  [⏳] XGBoost Optimizer                        │
│      Waiting to start...                       │
│                                                │
│  Overall Progress: 35%                         │
│  Estimated Time Remaining: ~18 minutes         │
│                                                │
└────────────────────────────────────────────────┘
```

**Real-time Updates:**
- WebSocket connection or polling every 2 seconds
- `GET /jobs/{job_id}` to fetch current status
- Parse output for progress indicators
- Animate progress bars smoothly
- Auto-scroll activity log

---

#### Component: Live Console Output
**Location:** Below progress tracker  
**Purpose:** Show raw optimizer output

**Layout:**
```
┌────────────────────────────────────────────────┐
│  Console Output                    [↓ Download] │
├────────────────────────────────────────────────┤
│  [●] Auto-scroll                               │
│                                                │
│  ======================================        │
│  🚀 FOGA Optimizer                            │
│  ======================================        │
│  Detected GCC source file. Using 'gcc'        │
│  Population size: 277                          │
│  Max generations: 10                           │
│  Execution timeout: 10s per test               │
│  --------------------------------------        │
│  🚀 Starting FOGA optimization...             │
│  Gen   1 | Valid:  89/277 | Best: 0.004532s  │
│  Gen   2 | Valid: 134/277 | Best: 0.004231s  │
│  Gen   3 | Valid: 156/277 | Best: 0.003982s  │
│  ...                                           │
│                                                │
└────────────────────────────────────────────────┘
```

**Features:**
- Monospace font (like terminal)
- Syntax highlighting for:
  - Success messages (green)
  - Error messages (red)
  - Info messages (blue)
  - Warnings (yellow)
- Auto-scroll toggle
- Download full output as .txt
- Search/filter functionality
- Copy to clipboard button

---

#### Component: Action Buttons
**Location:** Bottom of job status page

**Buttons:**
```
[⏸️ Pause]  [⏹️ Stop]  [🔄 Restart]  [🗑️ Delete]
```

**States:**
- **Running Jobs:** Show Pause and Stop
- **Completed Jobs:** Show Restart and Delete
- **Failed Jobs:** Show Restart and Delete
- **Paused Jobs:** Show Resume and Stop

**Confirmations:**
- Stop/Delete require confirmation modal
- Restart keeps same parameters but new job_id

---

### 4.3 Results Page Components

#### Component: Results Header
**Location:** Top of results page  
**Layout:**
```
┌────────────────────────────────────────────────┐
│  ✅ Optimization Complete                      │
│                                                │
│  🏆 Best Execution Time: 0.002891 seconds     │
│  ⏱️ Total Optimization Time: 847.32 seconds   │
│  🔬 Total Evaluations: 2,770                   │
│                                                │
│  [📥 Download Binary]  [💾 Export Results]    │
└────────────────────────────────────────────────┘
```

**Elements:**
- Success banner with emoji
- Key metrics in large, readable format
- Download buttons for:
  - Optimized binary
  - Results JSON
  - Full report (PDF/HTML)

---

#### Component: Performance Metrics Table
**Location:** Main results area  
**Purpose:** Compare optimization against baselines

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  Performance Comparison                                    │
├─────────────────┬──────────────────┬──────────────────────┤
│ Optimization    │ Execution Time   │ Improvement vs -O3   │
├─────────────────┼──────────────────┼──────────────────────┤
│ -O1             │ 0.008234s        │ -60.68% ⬇️           │
│ -O2             │ 0.006012s        │ -17.35% ⬇️           │
│ -O3 (Baseline)  │ 0.005123s        │ —                    │
│ 🏆 FOGA (Best)  │ 0.002891s        │ +43.57% ⬆️           │
├─────────────────┴──────────────────┴──────────────────────┤
│  Speedup Factor: 1.77x faster than -O3                    │
└────────────────────────────────────────────────────────────┘
```

**Features:**
- Color-coded improvement (green = better, red = worse)
- Sortable columns
- Highlight winner row
- Visual indicators (arrows, emojis)

---

#### Component: Enabled Flags Section
**Location:** Below metrics table  
**Purpose:** Show which compiler flags were selected

**Layout:**
```
┌────────────────────────────────────────────────┐
│  Enabled Compiler Flags (42 flags)            │
├────────────────────────────────────────────────┤
│  [Copy All]  [Export to Makefile]             │
│                                                │
│  Core Optimizations:                           │
│  -O3                                           │
│  -faggressive-loop-optimizations               │
│  -finline-functions                            │
│  -ftree-loop-vectorize                         │
│  -funroll-all-loops                            │
│                                                │
│  Additional Flags:                             │
│  -falign-functions                             │
│  -fcaller-saves                                │
│  -fcode-hoisting                               │
│  ... (show more)                               │
│                                                │
│  Compile Command:                              │
│  ┌──────────────────────────────────────────┐ │
│  │ gcc -O3 -faggressive-loop-optimizations  │ │
│  │ -finline-functions ... matrix.c -o out   │ │
│  └──────────────────────────────────────────┘ │
│  [📋 Copy Command]                             │
└────────────────────────────────────────────────┘
```

**Features:**
- Grouped flags by category
- Copy individual flags or all
- Generate ready-to-use compile command
- Export as Makefile snippet
- Expandable/collapsible sections

---

#### Component: Flag Importance Chart (HBRF only)
**Location:** HBRF results page  
**Purpose:** Show which flags had most impact

**Chart Type:** Horizontal bar chart

```
┌────────────────────────────────────────────────┐
│  Top 20 Most Important Flags                  │
├────────────────────────────────────────────────┤
│                                                │
│  -ftree-loop-vectorize     ████████████ 0.245 │
│  -finline-functions        ██████████   0.198 │
│  -funroll-all-loops        ████████     0.152 │
│  -faggressive-loop-opt     ███████      0.134 │
│  -fipa-cp-clone            ██████       0.121 │
│  -ftree-slp-vectorize      █████        0.098 │
│  -fcode-hoisting           ████         0.087 │
│  -fipa-modref              ████         0.076 │
│  ... (show all 20)                             │
│                                                │
│  [Download Full Report]                        │
└────────────────────────────────────────────────┘
```

**Features:**
- Interactive bars (hover for details)
- Color gradient (dark = more important)
- Importance scores displayed
- Downloadable as PNG/SVG

---

### 4.4 Comparison Page Components

#### Component: Winner Declaration Banner
**Location:** Top of comparison page  
**Layout:**
```
┌────────────────────────────────────────────────┐
│  🏆 COMPARISON RESULTS                         │
│                                                │
│  WINNER: HBRF Optimizer                        │
│  Achieved: 0.002645s                           │
│  43.2% better than second place (FOGA)         │
│  48.3% better than -O3 baseline                │
└────────────────────────────────────────────────┘
```

---

#### Component: Multi-Optimizer Comparison Table
**Layout:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Detailed Comparison                                             │
├────────────┬──────────────┬──────────────┬───────────┬──────────┤
│ Method     │ Exec Time    │ Opt Time     │ Evals     │ Rank     │
├────────────┼──────────────┼──────────────┼───────────┼──────────┤
│ -O1        │ 0.008234s    │ 0.12s        │ 1         │ #6       │
│ -O2        │ 0.006012s    │ 0.15s        │ 1         │ #5       │
│ -O3        │ 0.005123s    │ 0.18s        │ 1         │ #4       │
│ FOGA       │ 0.003012s    │ 847.32s      │ 2,770     │ #2       │
│ 🏆 HBRF    │ 0.002645s    │ 1,243.56s    │ 182       │ #1       │
│ XGBoost    │ 0.003156s    │ 623.41s      │ 150       │ #3       │
└────────────┴──────────────┴──────────────┴───────────┴──────────┘
```

**Features:**
- Sortable by any column
- Highlight winner row
- Show all metrics side-by-side
- Visual ranking indicators

---

#### Component: Comparison Charts
**Location:** Below comparison table  
**Chart 1: Execution Time Bar Chart**

```
Execution Time Comparison
│
│ 8ms ┤
│     │
│ 6ms ┤           ██
│     │     ██    ██
│ 4ms ┤     ██    ██
│     │     ██    ██    ██
│ 2ms ┤ ██  ██    ██    ██  🏆██  ██
│     │ ██  ██    ██    ██    ██  ██
│ 0ms └─██──██────██────██────██──██─
│      O1  O2    O3   FOGA  HBRF XGB
```

**Chart 2: Optimization Time vs Quality Scatter Plot**

```
Optimization Time vs Execution Time
│
│ Fast
│ Exec  HBRF●
│ Time         XGB●
│                  FOGA●
│        O3●
│     O2●
│  O1●
│ Slow
└────────────────────────────
  Short  →  Long Opt Time
```

**Chart 3: Evaluations Efficiency**

```
Evaluations per Second
│
│ 5.0 ┤                 ██
│     │                 ██
│ 4.0 ┤                 ██
│     │           ██    ██
│ 3.0 ┤     ██    ██    ██
│     │     ██    ██    ██
│ 2.0 ┤     ██    ██    ██
│     │     ██    ██    ██
│ 1.0 ┤ ██  ██    ██    ██
│     │ ██  ██    ██    ██
│ 0.0 └─██──██────██────██─
│     FOGA HBRF  XGB  O3
```

**Features:**
- Interactive charts (tooltips on hover)
- Downloadable as PNG/SVG/PDF
- Responsive design
- Color-coded for each optimizer

---

#### Component: Detailed Insights Panel
**Location:** Below charts  
**Purpose:** Provide analysis and recommendations

**Layout:**
```
┌────────────────────────────────────────────────┐
│  🔍 Analysis & Insights                        │
├────────────────────────────────────────────────┤
│                                                │
│  Key Findings:                                 │
│  • HBRF achieved the best execution time      │
│  • XGBoost was fastest optimizer (10 min)     │
│  • FOGA required most evaluations (2,770)     │
│  • All optimizers beat -O3 baseline           │
│                                                │
│  Recommendations:                              │
│  ✓ Use HBRF for maximum performance           │
│  ✓ Use XGBoost for quick optimizations        │
│  ✓ Use FOGA for thorough exploration          │
│                                                │
│  Trade-offs:                                   │
│  • HBRF: Best quality, longest time           │
│  • XGBoost: Good quality, medium time         │
│  • FOGA: Good quality, most evaluations       │
│                                                │
└────────────────────────────────────────────────┘
```

---

### 4.5 Jobs Dashboard Components

#### Component: Jobs List Filter Bar
**Location:** Top of jobs dashboard  
**Layout:**
```
┌────────────────────────────────────────────────┐
│  My Optimization Jobs                          │
├────────────────────────────────────────────────┤
│                                                │
│  Status: [All ▼] [Pending] [Running]          │
│          [Completed] [Failed]                  │
│                                                │
│  Optimizer: [All ▼] [FOGA] [HBRF] [XGBoost]  │
│             [Compare]                          │
│                                                │
│  Sort by: [Date ▼] [Duration] [Status]        │
│                                                │
│  Search: [🔍 ________________]  [Refresh]     │
│                                                │
└────────────────────────────────────────────────┘
```

**Features:**
- Multi-select filters
- Real-time search
- Sort options
- Active filter badges
- Clear all filters button

---

#### Component: Jobs Table
**Location:** Main content of jobs dashboard  
**Layout:**
```
┌────────────────────────────────────────────────────────────────────────┐
│  Job ID        │ Optimizer │ Source File    │ Status    │ Created     │
├────────────────┼───────────┼────────────────┼───────────┼─────────────┤
│ 123e4567...    │ 🧬 FOGA   │ matrix.c       │ ● Running │ 2m ago      │
│ [View Details] │           │                │           │             │
├────────────────┼───────────┼────────────────┼───────────┼─────────────┤
│ 789abcdef...   │ 🔬 HBRF   │ fibonacci.c    │ ✓ Done    │ 1h ago      │
│ [View Results] │           │                │           │             │
├────────────────┼───────────┼────────────────┼───────────┼─────────────┤
│ fedcba987...   │ 📊 Compare│ sort.cpp       │ ✗ Failed  │ 3h ago      │
│ [View Error]   │           │                │           │             │
└────────────────┴───────────┴────────────────┴───────────┴─────────────┘

[Previous] Page 1 of 5 [Next]
```

**Features:**
- Paginated (10-20 jobs per page)
- Clickable rows
- Status indicators with colors
- Relative timestamps
- Quick actions menu (⋮):
  - View Details
  - Download Results
  - Restart Job
  - Delete Job

---

#### Component: Job Card (Alternative to Table)
**Layout:** Card view for mobile/tablet

```
┌────────────────────────────────────┐
│  🧬 FOGA                           │
│  matrix_multiply.c                 │
│                                    │
│  Status: ● Running (65%)           │
│  Started: 5 minutes ago            │
│  Current: Gen 7/10                 │
│                                    │
│  [View] [Stop]                     │
└────────────────────────────────────┘
```

---

### 4.6 Shared Components

#### Component: Status Badge
**Reusable status indicator**

```css
Pending:   🟡 Pending
Running:   🔵 Running  (animated pulse)
Completed: 🟢 Completed
Failed:    🔴 Failed
```

**Styling:**
- Rounded pill shape
- Icon + text
- Color-coded background
- Subtle animation for "Running"

---

#### Component: Error Modal
**Display errors and warnings**

```
┌─────────────────────────────────────┐
│  ⚠️ Error                           │
├─────────────────────────────────────┤
│                                     │
│  Compilation failed:                │
│  undefined reference to 'main'      │
│                                     │
│  File: matrix_multiply.c            │
│  Line: N/A                          │
│                                     │
│  [View Full Log] [Dismiss]          │
└─────────────────────────────────────┘
```

**Features:**
- Auto-dismiss after 5 seconds (for non-critical)
- Persistent for critical errors
- Stack multiple notifications
- Copy error message button

---

#### Component: Confirmation Modal
**Confirm destructive actions**

```
┌─────────────────────────────────────┐
│  ⚠️ Confirm Action                  │
├─────────────────────────────────────┤
│                                     │
│  Are you sure you want to stop      │
│  this optimization?                 │
│                                     │
│  Job ID: 123e4567...                │
│  Progress will be lost.             │
│                                     │
│  [Cancel]  [Yes, Stop]              │
└─────────────────────────────────────┘
```

---

#### Component: Loading Spinner
**Show during async operations**

```
    ⏳ Loading...
    
   ◐ Uploading files...
   
   ◑ Starting optimization...
```

**Variations:**
- Small inline spinner
- Full-page overlay spinner
- Progress bar with percentage
- Skeleton loaders for content

---

## 5. API Integration

### 5.1 API Endpoints Mapping

| Frontend Action | API Endpoint | Method | Request | Response |
|----------------|--------------|--------|---------|----------|
| Submit FOGA job | `/optimize/foga` | POST | FormData | JobResponse |
| Submit HBRF job | `/optimize/hbrf` | POST | FormData | JobResponse |
| Submit XGBoost job | `/optimize/xgboost` | POST | FormData | JobResponse |
| Submit Compare job | `/optimize/compare` | POST | FormData | JobResponse |
| Get job status | `/jobs/{job_id}` | GET | - | OptimizationJob |
| Get job result | `/jobs/{job_id}/result` | GET | - | DetailedResult |
| List all jobs | `/jobs` | GET | Query params | JobsList |
| Delete job | `/jobs/{job_id}` | DELETE | - | SuccessMessage |
| Download binary | `/jobs/{job_id}/download` | GET | - | BinaryFile |
| Health check | `/health` | GET | - | HealthStatus |

### 5.2 Request/Response Examples

**Submit Optimization Job:**
```javascript
// Request
const formData = new FormData();
formData.append('source_file', sourceFile);
formData.append('test_input_file', testInputFile); // optional

fetch('/optimize/foga', {
  method: 'POST',
  body: formData
})

// Response
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "pending",
  "message": "FOGA optimization job created successfully"
}
```

**Poll Job Status:**
```javascript
// Request
fetch('/jobs/123e4567-e89b-12d3-a456-426614174000')

// Response
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "running",
  "optimizer": "foga",
  "source_file": "matrix_multiply.c",
  "created_at": "2025-12-03T14:23:15",
  "started_at": "2025-12-03T14:23:18",
  "completed_at": null,
  "result": null,
  "error": null
}
```

**Get Completed Results:**
```javascript
// Request
fetch('/jobs/123e4567-e89b-12d3-a456-426614174000/result')

// Response
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "optimizer": "foga",
  "output": "... full console output ...",
  "result": {
    "best_time": 0.002891,
    "total_time": 847.32,
    "evaluations": 2770,
    "enabled_flags": ["-O3", "-ftree-loop-vectorize", ...]
  }
}
```

### 5.3 Error Handling

**Error Response Format:**
```json
{
  "detail": "Error message",
  "status_code": 400/404/500
}
```

**Frontend Error Handling:**
```javascript
try {
  const response = await fetch('/optimize/foga', options);
  if (!response.ok) {
    const error = await response.json();
    showError(error.detail);
  }
} catch (error) {
  showError('Network error. Please check your connection.');
}
```

**Common Errors:**
- 400: Invalid file format
- 404: Job not found
- 500: Server error
- Timeout: Optimization took too long

---

## 6. State Management

### 6.1 Global State (Redux/Context API)

**State Structure:**
```javascript
{
  jobs: {
    activeJobs: [],      // Currently running
    completedJobs: [],   // Finished jobs
    failedJobs: []       // Failed jobs
  },
  currentJob: {
    jobId: null,
    status: null,
    progress: 0,
    output: [],
    result: null
  },
  ui: {
    theme: 'light',      // 'light' or 'dark'
    selectedOptimizer: null,
    uploadedFiles: {
      source: null,
      testInput: null
    }
  },
  api: {
    isHealthy: true,
    lastChecked: null
  }
}
```

### 6.2 Actions

```javascript
// Job Actions
SUBMIT_JOB
UPDATE_JOB_STATUS
FETCH_JOB_RESULT
DELETE_JOB
LOAD_JOBS_LIST

// UI Actions
SELECT_OPTIMIZER
UPLOAD_FILE
REMOVE_FILE
TOGGLE_THEME
SHOW_ERROR
HIDE_ERROR

// API Actions
CHECK_HEALTH
SET_HEALTH_STATUS
```

### 6.3 Real-time Updates

**Polling Strategy:**
```javascript
// Poll every 2 seconds when job is running
useEffect(() => {
  if (jobStatus === 'running' || jobStatus === 'pending') {
    const interval = setInterval(() => {
      fetchJobStatus(jobId);
    }, 2000);
    return () => clearInterval(interval);
  }
}, [jobId, jobStatus]);
```

**Alternative: WebSocket (if implemented):**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/jobs/{job_id}');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  dispatch(updateJobStatus(update));
};
```

---

## 7. Design System

### 7.1 Color Palette

**Primary Colors:**
```css
/* Brand */
--primary: #3498db;        /* Blue */
--secondary: #2ecc71;      /* Green */
--accent: #f39c12;         /* Orange */

/* Status Colors */
--success: #27ae60;        /* Green */
--warning: #f39c12;        /* Orange */
--error: #e74c3c;          /* Red */
--info: #3498db;           /* Blue */
--pending: #f1c40f;        /* Yellow */

/* Optimizer Colors */
--foga: #3498db;           /* Blue */
--hbrf: #2ecc71;           /* Green */
--xgboost: #f39c12;        /* Orange */
--compare: #9b59b6;        /* Purple */

/* Neutrals */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Background */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

/* Text */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;
```

**Dark Mode:**
```css
--bg-primary: #1f2937;
--bg-secondary: #111827;
--bg-tertiary: #0f172a;

--text-primary: #f9fafb;
--text-secondary: #d1d5db;
--text-tertiary: #9ca3af;
```

### 7.2 Typography

```css
/* Font Families */
--font-sans: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 7.3 Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### 7.4 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### 7.5 Border Radius

```css
--radius-sm: 0.25rem;  /* 4px */
--radius: 0.5rem;      /* 8px */
--radius-md: 0.75rem;  /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-full: 9999px; /* Fully rounded */
```

### 7.6 Animations

```css
/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Keyframes */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## 8. Wireframes & Layouts

### 8.1 Desktop Layout (1920x1080)

```
┌─────────────────────────────────────────────────────────────┐
│  Header (80px height)                                       │
│  Logo + Navigation + Status                                 │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                           │
│  Sidebar        │  Main Content Area                        │
│  (280px width)  │                                           │
│                 │  [Page-specific components]               │
│  - Quick Nav    │                                           │
│  - Info Panel   │                                           │
│  - Recent Jobs  │                                           │
│                 │                                           │
│                 │                                           │
│                 │                                           │
│                 │                                           │
│                 │                                           │
├─────────────────┴───────────────────────────────────────────┤
│  Footer (60px height)                                       │
│  Version | Status | Links                                   │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Tablet Layout (768x1024)

```
┌───────────────────────────────────────┐
│  Header (collapsed nav → hamburger)  │
├───────────────────────────────────────┤
│                                       │
│  Full-width Content                   │
│                                       │
│  [Page-specific components]           │
│                                       │
│  Sidebar slides in from left          │
│                                       │
├───────────────────────────────────────┤
│  Footer                               │
└───────────────────────────────────────┘
```

### 8.3 Mobile Layout (375x667)

```
┌─────────────────────┐
│  Header (compact)   │
│  ☰ Logo     [🌓]    │
├─────────────────────┤
│                     │
│  Stacked Content    │
│                     │
│  Cards instead of   │
│  tables             │
│                     │
│  Bottom nav for     │
│  quick actions      │
│                     │
├─────────────────────┤
│  [Home][Jobs][More] │
└─────────────────────┘
```

### 8.4 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) {  /* sm */
  /* Small tablets */
}

@media (min-width: 768px) {  /* md */
  /* Tablets */
}

@media (min-width: 1024px) { /* lg */
  /* Desktop */
}

@media (min-width: 1280px) { /* xl */
  /* Large desktop */
}
```

---

## 9. Accessibility

### 9.1 WCAG 2.1 Level AA Compliance

**Requirements:**
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators visible
- Alt text for images
- ARIA labels for interactive elements

### 9.2 Keyboard Shortcuts

```
Tab         - Navigate forward
Shift+Tab   - Navigate backward
Enter       - Activate button/link
Space       - Toggle checkbox/radio
Esc         - Close modal/dropdown
Arrow Keys  - Navigate lists/options
Ctrl+K      - Open search
```

### 9.3 ARIA Labels

```html
<button aria-label="Start optimization">
<input aria-describedby="error-message">
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
<nav aria-label="Main navigation">
<table aria-label="Optimization results">
```

---

## 10. Performance Optimization

### 10.1 Frontend Optimizations

**Code Splitting:**
- Lazy load routes
- Dynamic imports for heavy components
- Separate chunks for charts/visualizations

**Asset Optimization:**
- Compress images (WebP format)
- Minify CSS/JS
- Use CDN for static assets
- Implement caching strategies

**Rendering Optimization:**
- Virtual scrolling for long lists
- Debounce/throttle frequent updates
- Memoization for expensive computations
- React.memo for pure components

### 10.2 API Optimization

**Request Optimization:**
- Request deduplication
- Batch requests where possible
- Implement request cancellation
- Use ETag for caching

**Polling Optimization:**
```javascript
// Adaptive polling - slow down when job is stable
let pollInterval = 2000; // Start at 2s
if (noChangeCount > 5) {
  pollInterval = 5000; // Slow to 5s
}
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

**Components to Test:**
- File upload validation
- Status badge rendering
- Form validation logic
- API response parsing

### 11.2 Integration Tests

**Flows to Test:**
- Complete job submission flow
- Real-time status updates
- Results download
- Job management (delete, restart)

### 11.3 E2E Tests (Cypress/Playwright)

**Critical Paths:**
```javascript
describe('Optimization Flow', () => {
  it('should submit FOGA job and view results', () => {
    cy.visit('/');
    cy.get('[data-testid="foga-card"]').click();
    cy.get('input[type="file"]').attachFile('matrix.c');
    cy.get('[data-testid="submit-btn"]').click();
    cy.url().should('include', '/jobs/');
    cy.contains('Running', { timeout: 10000 });
  });
});
```

---

## 12. Technology Stack Recommendations

### 12.1 Framework Options

**Option 1: React + TypeScript**
- Pros: Large ecosystem, type safety, good performance
- Cons: More boilerplate
- Libraries:
  - React Router for routing
  - Redux Toolkit for state management
  - React Query for API calls
  - Recharts for visualizations
  - Tailwind CSS for styling

**Option 2: Vue 3 + TypeScript**
- Pros: Easy learning curve, great DX
- Cons: Smaller ecosystem than React
- Libraries:
  - Vue Router
  - Pinia for state
  - Axios for API
  - Chart.js for visualizations
  - Tailwind CSS

**Option 3: Next.js (React)**
- Pros: SSR, great performance, built-in routing
- Cons: Overkill for SPA
- Best if: Need SEO or server-side features

### 12.2 Recommended Stack

```
Frontend:     React 18 + TypeScript
Styling:      Tailwind CSS + shadcn/ui
State:        Zustand (lightweight) or Redux Toolkit
API:          React Query (TanStack Query)
Charts:       Recharts or Chart.js
Forms:        React Hook Form + Zod
Icons:        Lucide React or Heroicons
Build:        Vite
Testing:      Vitest + React Testing Library
E2E:          Playwright
```

---

## 13. File Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   ├── optimizer/
│   │   ├── OptimizerCard.tsx
│   │   ├── FileUpload.tsx
│   │   └── OptimizationForm.tsx
│   ├── job/
│   │   ├── JobHeader.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── ConsoleOutput.tsx
│   │   └── ActionButtons.tsx
│   ├── results/
│   │   ├── ResultsHeader.tsx
│   │   ├── MetricsTable.tsx
│   │   ├── FlagsSection.tsx
│   │   └── ImportanceChart.tsx
│   ├── comparison/
│   │   ├── WinnerBanner.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── ComparisonCharts.tsx
│   │   └── InsightsPanel.tsx
│   └── dashboard/
│       ├── JobsFilter.tsx
│       ├── JobsTable.tsx
│       └── JobCard.tsx
├── pages/
│   ├── Home.tsx
│   ├── JobStatus.tsx
│   ├── Results.tsx
│   ├── Comparison.tsx
│   ├── Dashboard.tsx
│   └── Documentation.tsx
├── api/
│   ├── client.ts
│   ├── jobs.ts
│   ├── optimizers.ts
│   └── types.ts
├── store/
│   ├── jobsSlice.ts
│   ├── uiSlice.ts
│   └── store.ts
├── hooks/
│   ├── useJobStatus.ts
│   ├── useOptimizer.ts
│   └── usePolling.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── styles/
│   ├── globals.css
│   └── variables.css
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

---

## 14. Implementation Phases

### Phase 1: Foundation (Week 1)
- Set up project structure
- Implement design system
- Create layout components
- Set up API client

### Phase 2: Core Features (Week 2-3)
- Home page with optimizer selection
- File upload component
- Job submission flow
- Basic job status page

### Phase 3: Real-time Features (Week 4)
- Real-time progress tracking
- Console output streaming
- Status updates
- Polling/WebSocket implementation

### Phase 4: Results & Visualization (Week 5)
- Results page with metrics
- Charts and visualizations
- Comparison page
- Export functionality

### Phase 5: Dashboard & Management (Week 6)
- Jobs dashboard
- Filtering and search
- Job management (delete, restart)
- History tracking

### Phase 6: Polish & Testing (Week 7-8)
- Responsive design refinement
- Accessibility improvements
- Performance optimization
- Testing and bug fixes

---

## 15. Additional Features (Future Enhancements)

### 15.1 Advanced Features
- **User Authentication:** Multi-user support with accounts
- **Job Scheduling:** Schedule optimizations for later
- **Notifications:** Email/push notifications on completion
- **Collaboration:** Share results with team members
- **Templates:** Save and reuse configurations
- **Batch Processing:** Upload multiple files at once
- **Custom Flags:** Allow users to add custom flags
- **A/B Testing:** Compare custom flag sets
- **API Key Management:** For programmatic access
- **Webhooks:** Trigger external services on completion

### 15.2 Analytics Dashboard
- Historical performance trends
- Flag usage statistics
- Optimizer success rates
- Average optimization times
- Most common source files

### 15.3 Educational Features
- Interactive tutorials
- Flag explanation tooltips
- Optimization guides
- Best practices recommendations
- Case studies

---

## Appendix A: API Response Examples

### Full Job Status Response
```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "optimizer": "foga",
  "source_file": "matrix_multiply.c",
  "created_at": "2025-12-03T14:23:15.123456",
  "started_at": "2025-12-03T14:23:18.654321",
  "completed_at": "2025-12-03T14:37:45.987654",
  "result": {
    "best_time": 0.002891,
    "total_time": 847.32,
    "evaluations": 2770,
    "enabled_flags": [
      "-O3",
      "-faggressive-loop-optimizations",
      "-finline-functions",
      "-ftree-loop-vectorize",
      "-funroll-all-loops"
    ]
  },
  "error": null
}
```

### Comparison Results Response
```json
{
  "timestamp": "2025-12-03T15:45:23.123456",
  "source_file": "matrix_multiply.c",
  "baseline": {
    "-O1": 0.008234,
    "-O2": 0.006012,
    "-O3": 0.005123
  },
  "FOGA": {
    "best_time": 0.003012,
    "total_time": 847.32,
    "evaluations": 2770
  },
  "HBRF": {
    "best_time": 0.002645,
    "total_time": 1243.56,
    "evaluations": 182
  },
  "XGBOOST": {
    "best_time": 0.003156,
    "total_time": 623.41,
    "evaluations": 150
  },
  "winner": "HBRF",
  "improvements": {
    "FOGA_vs_O3": 41.23,
    "HBRF_vs_O3": 48.37,
    "XGBOOST_vs_O3": 38.41
  }
}
```

---

## Appendix B: Color Reference Chart

```
Status Colors:
🟡 #f1c40f - Pending
🔵 #3498db - Running
🟢 #27ae60 - Completed
🔴 #e74c3c - Failed

Optimizer Colors:
🧬 #3498db - FOGA (Blue)
🔬 #2ecc71 - HBRF (Green)
⚡ #f39c12 - XGBoost (Orange)
📊 #9b59b6 - Compare (Purple)

Baseline Colors:
⚪ #95a5a6 - O1 (Gray)
⚪ #7f8c8d - O2 (Dark Gray)
⚪ #34495e - O3 (Darker Gray)
```

---

## Appendix C: Component Priority Matrix

| Component | Priority | Complexity | Dependencies |
|-----------|----------|------------|--------------|
| Optimizer Selection | High | Low | None |
| File Upload | High | Medium | Form validation |
| Job Status Tracker | High | High | API polling |
| Results Table | High | Medium | Data parsing |
| Progress Bar | High | Medium | Real-time updates |
| Comparison Charts | Medium | High | Chart library |
| Jobs Dashboard | Medium | Medium | Filtering logic |
| Console Output | Medium | Low | Syntax highlighting |
| Dark Mode Toggle | Low | Low | Theme context |
| Export Features | Low | Medium | File generation |

---

**End of Document**

This comprehensive frontend specification provides all the details needed to implement a professional, user-friendly interface for the compiler optimization tools. The design prioritizes usability, real-time feedback, and clear visualization of optimization results.
