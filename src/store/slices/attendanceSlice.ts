import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { attendanceApi } from '../../api/attendance';
import { Attendance, AttendanceCreate, AttendanceUpdate, AttendanceSummary } from '../../types';

interface AttendanceState {
  records: Attendance[];
  selectedRecord: Attendance | null;
  summary: AttendanceSummary | null;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  selectedRecord: null,
  summary: null,
  total: 0,
  loading: false,
  error: null,
};

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params?: {
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
    skip?: number;
    limit?: number;
  }) => {
    const response = await attendanceApi.getAll(params);
    return response;
  }
);

export const fetchAttendanceByEmployee = createAsyncThunk(
  'attendance/fetchByEmployee',
  async ({ employeeId, params }: { employeeId: string; params?: { start_date?: string; end_date?: string } }) => {
    const response = await attendanceApi.getByEmployee(employeeId, params);
    return response;
  }
);

export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchById',
  async (id: number) => {
    const record = await attendanceApi.getById(id);
    return record;
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (data: AttendanceCreate) => {
    const record = await attendanceApi.mark(data);
    return record;
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data }: { id: number; data: AttendanceUpdate }) => {
    const record = await attendanceApi.update(id, data);
    return record;
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id: number) => {
    await attendanceApi.delete(id);
    return id;
  }
);

export const fetchAttendanceSummary = createAsyncThunk(
  'attendance/fetchSummary',
  async ({ employeeId, params }: { employeeId: string; params?: { start_date?: string; end_date?: string } }) => {
    const summary = await attendanceApi.getSummary(employeeId, params);
    return summary;
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearSelectedRecord: (state) => {
      state.selectedRecord = null;
    },
    clearSummary: (state) => {
      state.summary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records || [];
        state.total = action.payload.total;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance';
      })

      // Fetch Attendance By Employee
      .addCase(fetchAttendanceByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.records || [];
        state.total = action.payload.total;
      })
      .addCase(fetchAttendanceByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee attendance';
      })

      // Fetch Attendance By ID
      .addCase(fetchAttendanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload;
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance record';
      })

      // Mark Attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records.unshift(action.payload);
        state.total += 1;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to mark attendance';
      })

      // Update Attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(rec => rec.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
        if (state.selectedRecord?.id === action.payload.id) {
          state.selectedRecord = action.payload;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update attendance';
      })

      // Delete Attendance
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(rec => rec.id !== action.payload);
        state.total -= 1;
        if (state.selectedRecord?.id === action.payload) {
          state.selectedRecord = null;
        }
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete attendance';
      })

      // Fetch Attendance Summary
      .addCase(fetchAttendanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchAttendanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch attendance summary';
      });
  },
});

export const { clearSelectedRecord, clearSummary, clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;