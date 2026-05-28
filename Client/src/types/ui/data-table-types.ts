import {
  ColumnDef,
  PaginationState,
  Row,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { MutationResponse } from "@/types/api/auth";

export interface ApiQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  search?: string;
  include?: Record<string, boolean>;
}

export interface ApiResponse<TData> {
  data: TData[];
  totalCount: number;
  totalPages: number;
}

export interface ExpandedContentProps<TData> {
  rowData: TData;
  handleSave?: (newData: Partial<TData>) => void;
  handleEdit?: (row: Partial<TData>) => void;
  toggleEditMode?: (rowId: string | number) => void;
}

export interface DataTableProps<TData> {
  fetchData: (
    params: ApiQueryParams
  ) => Promise<ApiResponse<TData> | MutationResponse<TData[]>>;
  initialData?: TData[];
  // @ts-ignore
  addData: (data: Partial<TData>) => Promise<MutationResponse<TData>>;
  // @ts-ignore
  updateData: (data: TData) => Promise<MutationResponse<TData>>;
  deleteData?: (id: number) => Promise<MutationResponse<null>>;
  columns: ColumnDef<TData>[];
  searchable?: boolean;
  isPagination?: boolean;
  actions?: TableAction<TData>[] | null;
  test?: string;
  defaultPageSize?: number;
  renderExpandedContent?: (
    props: ExpandedContentProps<TData>
  ) => React.ReactNode;
  renderEditContent?: (props: ExpandedContentProps<TData>) => React.ReactNode;
  showAddButton?: boolean;
  idField?: keyof TData;
  onRowClick?: (row: Row<TData>) => void;
  selectedRowId?: string | number | null;
  sorting?: SortingState;
  onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
  rightHeaderContent?: React.ReactNode;
  renderToolbar?: (ctx: DataTableToolbarContext) => React.ReactNode;
  websocketUrl?: string;
  channelId?: string;
}

export interface DataTableToolbarContext {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  toggleAddRow: () => void;
}

export interface TableAction<TData> {
  label: string;
  onClick?: (row: Row<TData>) => void;
  type?: "edit" | "delete" | string;
  editData?: Partial<TData>;
  render?: (row: Row<TData>) => React.ReactNode;
}

export interface DataTableContextProps {
  globalFilter: string;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  sorting: SortingState;
  columns: ColumnDef<any>[];
  table: Table<any>;
  enhancedActions: (TableAction<any> & { icon: React.ReactNode })[] | null;
  renderExpandedContent?: (props: ExpandedContentProps<any>) => React.ReactNode;
  renderEditContent?: (props: ExpandedContentProps<any>) => React.ReactNode;
  specialRow: "add" | null;
  setSpecialRow: React.Dispatch<React.SetStateAction<"add" | null>>;
  handleAdd: (newData: any) => void;
  handleUpdateData: (newData: any) => void;
  onRowClick?: (row: Row<any>) => void;
  selectedRowId?: string | number | null;
  isLoading: boolean;
  toggleEditMode: (rowId: string | number) => void;
  idField?: string;
}
