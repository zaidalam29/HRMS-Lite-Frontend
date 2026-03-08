import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { employeeApi } from '../../api/employees';
import { Employee, EmployeeCreate, EmployeeUpdate } from '../../types';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  total: 0,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params?: { skip?: number; limit?: number; department?: string }) => {
    const response = await employeeApi.getAll(params);
    return response;
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: string) => {
    const employee = await employeeApi.getById(id);
    return employee;
  }
);

export const createEmployee = createAsyncThunk(
  'employees/create',
  async (data: EmployeeCreate) => {
    const employee = await employeeApi.create(data);
    return employee;
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: string; data: EmployeeUpdate }) => {
    const employee = await employeeApi.update(id, data);
    return employee;
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string) => {
    await employeeApi.delete(id);
    return id;
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.employees || [];
        state.total = action.payload.total;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })

      // Fetch Employee By ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employee';
      })

      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create employee';
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(emp => emp.employee_id === action.payload.employee_id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.selectedEmployee?.employee_id === action.payload.employee_id) {
          state.selectedEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update employee';
      })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(emp => emp.employee_id !== action.payload);
        state.total -= 1;
        if (state.selectedEmployee?.employee_id === action.payload) {
          state.selectedEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete employee';
      });
  },
});

export const { clearSelectedEmployee, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;