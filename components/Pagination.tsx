import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PaginationButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-6 w-6 items-center justify-center rounded-[2px] border text-[8px] font-medium ${
        active
          ? "border-primary bg-primary text-white"
          : "border-[#E1E5EF] bg-white text-slate-neutral-dark"
      } ${
        disabled
          ? "cursor-default opacity-50"
          : "hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      );
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="mt-16 sm:flex sm:justify-end border-t border-[#E5E8F0] pt-5 max-md:mb-20 max-md:mt-8 hidden">
      <div className="flex items-center gap-1">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
        >
          ‹
        </PaginationButton>

        {getPageNumbers().map(
          (page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-6 w-6 items-center justify-center text-[8px] text-slate-neutral-medium"
              >
                ...
              </span>
            ) : (
              <PaginationButton
                key={page}
                active={page === currentPage}
                onClick={() =>
                  onPageChange(page as number)
                }
              >
                {page}
              </PaginationButton>
            ),
        )}

        <PaginationButton
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
        >
          ›
        </PaginationButton>
      </div>
    </div>
  );
}
