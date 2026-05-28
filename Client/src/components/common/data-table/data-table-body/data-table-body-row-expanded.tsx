import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { Row } from "@tanstack/react-table";
import Backdrop from "@/components/common/data-table/dialogs/Backdrop";
import { DataTableContext } from "@/components/common/data-table/data-table-context";

interface RowComponentProps<T> {
  row?: Row<T>;
  onBackdropClick?: () => void;
  isExpanded?: boolean;
}

function DataTableBodyRowExpanded<T>({
  row,
  onBackdropClick,
  isExpanded,
}: RowComponentProps<T>) {
  const {
    enhancedActions,
    columns,
    handleAdd,
    // @ts-ignore
    handleUpdate,
    renderExpandedContent,
    renderEditContent,
    toggleEditMode,
    idField,
    specialRow,
    setSpecialRow,
  } = useContext(DataTableContext);

  const colSpan = columns.length + (enhancedActions ? 1 : 0);
  const rowData = row?.original ?? ({} as T);
  // @ts-ignore
  const isEditMode = !!row?.original?.isEditMode;
  const rowId =
    idField && row?.original ? (row.original as any)[idField] : null;

  const handleClose = () => {
    row?.toggleExpanded();
    if (rowId && isEditMode) toggleEditMode(rowId);
    onBackdropClick?.();
  };

  const handleSave = async (newData: Partial<T>) => {
    try {
      if (handleAdd) await handleAdd(newData);
      
      // Close the form after successful creation
      if (specialRow === "add" && setSpecialRow) {
        // Close the add form after successful creation
        setSpecialRow(null);
      } else if (rowId) {
        // Close edit mode for existing row
        toggleEditMode(rowId);
      }
      
      // Also close the expanded row if it's open
      if (row && isExpanded) {
        row.toggleExpanded();
      }
    } catch (error) {
      // If there's an error, don't close the form
      console.error("Error saving:", error);
    }
  };

  const handleEdit = async (newData: Partial<T>) => {
    try {
      if (handleUpdate) await handleUpdate(newData);
      
      // Close the expanded row after successful update
      if (row && isExpanded) {
        row.toggleExpanded();
      }
      
      // Close edit mode if it was in edit mode
      if (rowId && isEditMode) {
        toggleEditMode(rowId);
      }
    } catch (error) {
      // If there's an error, don't close the form
      console.error("Error updating:", error);
    }
  };

  const renderContent = () => {
    const sharedProps = {
      rowData,
      handleSave,
      handleEdit,
    };

    if (specialRow) {
      return renderEditContent
        ? renderEditContent(sharedProps)
        : renderExpandedContent?.({
            ...sharedProps,
            toggleEditMode: () => rowId && toggleEditMode(rowId),
          });
    }

    if (isEditMode && renderEditContent) return renderEditContent(sharedProps);
    if (!isEditMode && renderExpandedContent) {
      return renderExpandedContent({
        ...sharedProps,
        toggleEditMode: () => rowId && toggleEditMode(rowId),
      });
    }
    if (renderExpandedContent) return renderExpandedContent(sharedProps);
    if (renderEditContent) return renderEditContent(sharedProps);
    return null;
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && <Backdrop onClick={handleClose} />}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <tr className="relative">
            <td colSpan={colSpan}>
              <motion.div
                key={`expanded-${row?.id ?? "custom"}`}
                className="relative z-40 w-full max-h-[calc(100vh-180px)] overflow-y-auto bg-surface rounded-lg shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                {renderContent()}
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export default DataTableBodyRowExpanded;
