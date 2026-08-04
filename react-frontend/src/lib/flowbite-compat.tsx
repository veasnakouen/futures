import * as React from "react";
import { Button as SButton } from "@/components/ui/button";
import { Badge as SBadge } from "@/components/ui/badge";
import { Input as SInput } from "@/components/ui/input";
import { Textarea as STextarea } from "@/components/ui/textarea";
import { Checkbox as SCheckbox } from "@/components/ui/checkbox";
import { Label as SLabel } from "@/components/ui/label";
import { Spinner as SSpinner } from "@/components/ui/spinner";
import {
  Card as SCard,
  CardContent as SCardContent,
} from "@/components/ui/card";
import {
  Alert as SAlert,
  AlertDescription as SAlertDescription,
} from "@/components/ui/alert";
import {
  Avatar as SAvatar,
  AvatarFallback as SAvatarFallback,
  AvatarImage as SAvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog as SDialog,
  DialogContent as SDialogContent,
  DialogHeader as SDialogHeader,
  DialogTitle as SDialogTitle,
  DialogFooter as SDialogFooter,
  DialogClose as SDialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  Table as STable,
  TableBody as STableBody,
  TableCell as STableCell,
  TableHead as STableHead,
  TableHeader as STableHeader,
  TableRow as STableRow,
} from "@/components/ui/table";
import {
  DropdownMenu as SDropdownMenu,
  DropdownMenuContent as SDropdownMenuContent,
  DropdownMenuItem as SDropdownMenuItem,
  DropdownMenuSeparator as SDropdownMenuSeparator,
  DropdownMenuTrigger as SDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover as SPopover,
  PopoverTrigger as SPopoverTrigger,
  PopoverContent as SPopoverContent,
} from "@/components/ui/popover";
// Note: We use native select styled like shadcn for seamless flowbite-react Select drop-in.
// For Switch, we will assume it's installed.
import { Switch as SSwitch } from "@/components/ui/switch";
export const Button = React.forwardRef(
  (
    { color, outline, size, isProcessing, children, className, ...props }: any,
    ref: any,
  ) => {
    let variant = "default";
    if (color === "light" || color === "gray" || outline) variant = "outline";
    if (color === "failure") variant = "destructive";
    if (color === "success" || color === "emerald") variant = "default";
    // we will add custom class for green
    let sizeClass = "default";
    if (size === "sm" || size === "xs") sizeClass = "sm";
    if (size === "lg") sizeClass = "lg";
    return (
      <SButton
        ref={ref}
        variant={variant as any}
        size={sizeClass as any}
        className={
          className +
          (color === "emerald" || color === "success"
            ? " bg-emerald-600 hover:bg-emerald-700 text-white"
            : "")
        }
        disabled={isProcessing || props.disabled}
        {...props}
      >
        {" "}
        {isProcessing && <SSpinner className="mr-2 h-4 w-4" />} {children}{" "}
      </SButton>
    );
  },
);
Button.displayName = "Button";
export const Badge = ({
  color,
  children,
  className,
  icon: Icon,
  ...props
}: any) => {
  let variant = "default";
  if (color === "failure") variant = "destructive";
  if (color === "gray" || color === "light") variant = "secondary";
  if (color === "warning") variant = "outline";
  const customClasses: string[] = [];
  if (color === "success")
    customClasses.push("bg-emerald-500 hover:bg-emerald-600 text-white");
  if (color === "warning")
    customClasses.push("text-amber-600 border-amber-600");
  return (
    <SBadge
      variant={variant as any}
      className={`${customClasses.join("")} ${className || ""}`}
      {...props}
    >
      {" "}
      {Icon && <Icon className="mr-1 h-3 w-3" />} {children}{" "}
    </SBadge>
  );
};
// 
import { cn } from "@/lib/utils";
export const TextInput = React.forwardRef(
  ({ icon: Icon, rightIcon: RightIcon, color, sizing, helperText, addon, className, ...props }: any, ref: any) => {
    return (
      <div className="w-full">
        {addon && (
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r-0 rounded-l-lg dark:bg-gray-700 dark:text-gray-300">
            {addon}
          </span>
        )}
        <div className="relative w-full">
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <SInput
            ref={ref}
            className={cn(Icon ? "pl-10" : "", RightIcon ? "pr-10" : "", className)}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              <RightIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        {helperText && <p className="text-xs mt-1 text-muted-foreground">{helperText}</p>}
      </div>
    );
  },
);
TextInput.displayName = "TextInput";

// 
export const Textarea = React.forwardRef(
  ({ className, ...props }: any, ref: any) => {
    return <STextarea ref={ref} className={cn(className)} {...props} />;
  },
);
Textarea.displayName = "Textarea";
export const Checkbox = React.forwardRef(
  ({ className, ...props }: any, ref: any) => {
    // flowbite-react uses standard onChange, shadcn uses onCheckedChange
    return (
      <SCheckbox
        ref={ref}
        className={className}
        onCheckedChange={
          props.onChange
            ? (c) => props.onChange({ target: { checked: c } })
            : undefined
        }
        checked={props.checked}
        id={props.id}
      />
    );
  },
);
Checkbox.displayName = "Checkbox";
// 
export const Label = ({ value, children, className, ...props }: any) => {
  return (
    <SLabel className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", className)} {...props}>
      {value || children}
    </SLabel>
  );
};
// 
export const Spinner = ({ size, className, ...props }: any) => {
  return (
    <SSpinner
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"}
      className={className}
      {...props}
    />
  );
};
export const Card = ({ children, className, ...props }: any) => {
  return (
    <SCard className={className} {...props}>
      {" "}
      <SCardContent className="p-4 sm:p-6">{children}</SCardContent>{" "}
    </SCard>
  );
};
// 
export const Alert = ({
  color,
  icon: Icon,
  children,
  className,
  additionalContent,
  ...props
}: any) => {
  let variant = "default";
  if (color === "failure") variant = "destructive";
  const customClasses: string[] = [];
  if (color === "success")
    customClasses.push("bg-emerald-50 text-emerald-800 border-emerald-200");
  if (color === "warning")
    customClasses.push("bg-amber-50 text-amber-800 border-amber-200");
  if (color === "info")
    customClasses.push("bg-blue-50 text-blue-800 border-blue-200");
  return (
    <SAlert
      variant={variant as any}
      className={`${customClasses.join("")} ${className || ""}`}
      {...props}
    >
      {" "}
      {Icon && <Icon className="h-4 w-4" />}{" "}
      <SAlertDescription className={Icon ? "ml-2" : ""}>
        {children}
        {additionalContent}
      </SAlertDescription>{" "}
    </SAlert>
  );
};
// 
export const Avatar = ({
  img,
  rounded,
  size,
  className,
  placeholderInitials,
  stacked,
  ...props
}: any) => {
  return (
    <SAvatar
      className={`${size === "lg" ? "h-12 w-12" : size === "sm" ? "h-8 w-8" : "h-10 w-10"} ${!rounded ? "rounded-md" : ""} ${className || ""}`}
      {...props}
    >
      {" "}
      {img && <SAvatarImage src={img} />}{" "}
      <SAvatarFallback>{placeholderInitials || "U"}</SAvatarFallback>{" "}
    </SAvatar>
  );
};
//
export const ToggleSwitch = ({ checked, onChange, label, className }: any) => {
  return (
    <div className={`flex items-center space-x-2 ${className || ""}`}>
      {" "}
      <SSwitch checked={checked} onCheckedChange={onChange} />{" "}
      {label && <SLabel>{label}</SLabel>}{" "}
    </div>
  );
};
// Select component that looks like shadcn but uses native select for easy replacement
export const Select = React.forwardRef(
  ({ className, icon: Icon, children, ...props }: any, ref: any) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:focus-visible:ring-indigo-400/30 transition-all duration-200 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&>option]:bg-white [&>option]:dark:bg-gray-900 [&>option]:text-gray-900 [&>option]:dark:text-gray-100",
            Icon ? "pl-10" : "",
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);
Select.displayName = "Select";
export const FileInput = React.forwardRef(
  ({ className, ...props }: any, ref: any) => {
    return <SInput type="file" ref={ref} className={className} {...props} />;
  },
);
FileInput.displayName = "FileInput";
// Dropdown mapping
export const Dropdown = ({
  label,
  children,
  inline,
  arrowIcon,
  renderTrigger,
  ...props
}: any) => {
  return (
    <SDropdownMenu>
      <SDropdownMenuTrigger asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : inline ? (
          <span className="cursor-pointer">{label}</span>
        ) : (
          <SButton variant="outline" size="sm" {...props}>
            {label}
          </SButton>
        )}
      </SDropdownMenuTrigger>
      <SDropdownMenuContent>{children}</SDropdownMenuContent>
    </SDropdownMenu>
  );
};

export const DropdownHeader = ({ children, className }: any) => (
  <div className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b  ${className || ""}`}>
    {children}
  </div>
);
export const DropdownItem = ({
  onClick,
  children,
  className,
  icon: Icon,
}: any) => (
  <SDropdownMenuItem onClick={onClick} className={className}>
    {" "}
    {Icon && <Icon className="mr-2 h-4 w-4" />} {children}{" "}
  </SDropdownMenuItem>
);
export const DropdownDivider = ({ className }: any) => (
  <SDropdownMenuSeparator className={className} />
);

Dropdown.Item = DropdownItem;
Dropdown.Header = DropdownHeader;
Dropdown.Divider = DropdownDivider;

// Table mapping
export const Table = ({ hoverable, ...props }: any) => <STable {...props} />;
export const TableBody = STableBody;
export const TableRow = STableRow;
export const TableCell = STableCell;
export const TableHead = ({ children, className }: any) => {
  const childrenArray = React.Children.toArray(children);
  const hasTableRowChild = childrenArray.some((child: any) => {
    if (!React.isValidElement(child)) return false;
    const type: any = child.type;
    const name = type?.displayName || type?.name || (typeof type === "string" ? type : "");
    return name.includes("Row") || name === "tr" || name === "STableRow" || name === "TableRow";
  });

  return (
    <STableHeader className={className}>
      {hasTableRowChild ? children : <STableRow>{children}</STableRow>}
    </STableHeader>
  );
};
export const TableHeadCell = STableHead;
// Modal mapping
export const ModalHeader = ({ children, className }: any) => {
  const isText = typeof children === "string" || typeof children === "number";
  return (
    <SDialogHeader className={cn("modal-header cursor-move select-none border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 flex flex-row items-center justify-between pr-4", className)}>
      {isText ? (
        <SDialogTitle className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white px-6 py-4">
          {children}
        </SDialogTitle>
      ) : (
        <SDialogTitle asChild className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white px-6 py-4">
          <div>{children}</div>
        </SDialogTitle>
      )}
      <SDialogClose className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:pointer-events-none shadow-sm">
        <X className="h-4 w-4" strokeWidth={2.5} />
        <span className="sr-only">Close</span>
      </SDialogClose>
    </SDialogHeader>
  );
};
export const ModalBody = ({ children, className }: any) => {
  const hasCustomLayout = className && (className.includes("overflow-") || className.includes("max-h-"));
  return (
    <div
      className={cn(
        "p-6 bg-gray-50/50 dark:bg-[#0a0a0a]",
        !hasCustomLayout && "max-h-[70vh] overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
};
export const ModalFooter = ({ children, className }: any) => (
  <SDialogFooter
    className={`px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-end gap-3 ${className || ""}`}
  >
    {" "}
    {children}{" "}
  </SDialogFooter>
);
export const Modal = Object.assign(
  ({ show, onClose, size, dismissible = true, children, ...props }: any) => {
    let maxW = "max-w-2xl";
    if (size === "sm") maxW = "max-w-sm";
    if (size === "md") maxW = "max-w-md";
    if (size === "lg") maxW = "max-w-lg";
    if (size === "xl") maxW = "max-w-xl";
    if (size === "2xl") maxW = "max-w-2xl";
    if (size === "3xl") maxW = "max-w-3xl";
    if (size === "4xl") maxW = "max-w-4xl";
    if (size === "5xl") maxW = "max-w-5xl";
    if (size === "6xl") maxW = "max-w-6xl";
    if (size === "7xl") maxW = "max-w-7xl";
    return (
      <SDialog open={show} onOpenChange={(open) => {
        // Only ignore if it's an outside click (which is handled by onInteractOutside)
        // If Radix triggers onOpenChange(false), it means the close button was clicked or Escape was pressed.
        // We should always allow the close button to close it.
        if (!open && onClose) onClose();
      }}>
        {" "}
        <SDialogContent
          hideCloseButton={true}
          className={`${maxW} p-0 border border-gray-200/60 dark:border-gray-800/60 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] gap-0 sm:rounded-2xl overflow-hidden flex flex-col max-h-[90vh]`}
          onEscapeKeyDown={(e) => {
            if (!dismissible) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (!dismissible) {
              e.preventDefault();
              return;
            }
            const target = e.target as Element;
            if (
              target &&
              target.closest &&
              (target.closest(".react-select__menu") ||
                target.closest('[class*="react-select"]') ||
                target.closest('[role="listbox"]') ||
                target.closest("[data-radix-popper-content-wrapper]") ||
                target.hasAttribute("data-radix-focus-guard"))
            ) {
              e.preventDefault();
            }
          }}
        >
          {" "}
          {children}{" "}
        </SDialogContent>{" "}
      </SDialog>
    );
  },
  {
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
  }
);
export const Progress = ({ progress, size, color, label, className }: any) => {
  return (
    <div className={`w-full ${className || ""}`}>
      {" "}
      {label && <SLabel className="text-xs mb-1 block">{label}</SLabel>}{" "}
      <div
        className={`w-full bg-secondary rounded-full overflow-hidden ${size === "sm" ? "h-1.5" : size === "lg" ? "h-4" : "h-2.5"}`}
      >
        {" "}
        <div
          className={`h-full transition-all duration-500 ease-in-out ${color === "emerald" || color === "success" ? "bg-emerald-500" : color === "failure" ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        />{" "}
      </div>{" "}
    </div>
  );
};
export const Popover = ({ content, children, placement, trigger }: any) => {
  return (
    <SPopover>
      <SPopoverTrigger asChild>
        {children}
      </SPopoverTrigger>
      <SPopoverContent
        side={placement === "bottom" ? "bottom" : placement === "top" ? "top" : placement === "right" ? "right" : placement === "left" ? "left" : "bottom"}
        align="start"
        className="w-auto p-0 border-none bg-transparent shadow-none z-[100]"
      >
        {content}
      </SPopoverContent>
    </SPopover>
  );
};
export const Tabs = ({ children }: any) => {
  return <div>{children}</div>;
};
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: any) => {
  // basic wrapper placeholder
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      {" "}
      <SButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Prev
      </SButton>{" "}
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>{" "}
      <SButton
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </SButton>{" "}
    </div>
  );
};
export const Tooltip = ({ content, children, className }: any) => {
  return (
    <div
      title={typeof content === "string" ? content : "Tooltip"}
      className={`inline-block ${className || ""}`}
    >
      {children}
    </div>
  );
};
export const Drawer = ({
  open,
  onClose,
  children,
  position,
  className,
}: any) => {
  if (!open) return null;
  return (
    <>
      {" "}
      <div
        className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-gray-900/80"
        onClick={onClose}
      ></div>{" "}
      <div
        className={`fixed z-50 overflow-y-auto bg-white dark:bg-gray-800 p-4 transition-transform ${position === "right" ? "right-0 top-0 h-screen w-80" : "left-0 top-0 h-screen w-80"} ${className || ""}`}
      >
        {" "}
        {children}{" "}
      </div>{" "}
    </>
  );
};
export const DrawerItems = ({ children }: any) => <div>{children}</div>;
import {
  Accordion as SAccordion,
  AccordionContent as SAccordionContent,
  AccordionItem as SAccordionItem,
  AccordionTrigger as SAccordionTrigger,
} from "@/components/ui/accordion";
export const Accordion = ({ children, className, collapseAll }: any) => (
  <SAccordion
    type="multiple"
    defaultValue={!collapseAll ? ["0"] : []}
    className={className}
  >
    {React.Children.map(children, (child, i) =>
      React.cloneElement(child, { value: i.toString() }),
    )}
  </SAccordion>
);
export const AccordionPanel = ({ children, value, className }: any) => {
  return (
    <SAccordionItem value={value || "0"} className={className}>
      {children}
    </SAccordionItem>
  );
};
export const AccordionTitle = ({ children, className }: any) => (
  <SAccordionTrigger className={className}>{children}</SAccordionTrigger>
);
export const AccordionContent = ({ children, className }: any) => (
  <SAccordionContent className={className}>{children}</SAccordionContent>
);
import CustomDatePicker from "@/components/common/DatePicker";

export const Datepicker = ({ className, value, onChange, placeholder, type, ...props }: any) => {
  // Try to parse existing string values to Date objects
  const parsedDate = value ? new Date(value) : null;
  const isValidDate = parsedDate && !isNaN(parsedDate.getTime());

  return (
    <CustomDatePicker
      value={isValidDate ? parsedDate : null}
      onChange={(date: Date) => {
        if (onChange) {
          try {
            let formattedDate = '';
            if (date) {
              if (type === "datetime-local") {
                const offset = date.getTimezoneOffset() * 60000;
                formattedDate = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
              } else {
                formattedDate = date.toISOString().split('T')[0];
              }
            }
            onChange({ target: { value: formattedDate, name: props.name } });
          } catch (e) {
            onChange(date);
          }
        }
      }}
      placeholder={placeholder}
      className={className}
      disabled={props.disabled}
      {...props}
    />
  );
};
export const AvatarGroup = ({ children, className }: any) => (
  <div className={`flex -space-x-4 ${className || ""}`}>{children}</div>
);
export const AvatarGroupCounter = ({ total, className }: any) => (
  <div
    className={`relative flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full ${className || ""}`}
  >
    +{total}
  </div>
);
export const FloatingLabel = ({ variant, label, ...props }: any) => (
  <div className="relative z-0 w-full group">
    {" "}
    <SInput
      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer rounded-none h-auto"
      placeholder=" "
      {...props}
    />{" "}
    <SLabel className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
      {label}
    </SLabel>{" "}
  </div>
);
