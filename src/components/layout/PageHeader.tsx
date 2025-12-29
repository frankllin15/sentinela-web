import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export interface PageHeaderProps {
  // Core content
  title: string;
  subtitle?: string;
  icon?: LucideIcon;

  // Navigation
  breadcrumbs: BreadcrumbItemType[];
  showBackButton?: boolean;
  backButtonText?: string;
  onBackClick?: () => void;

  // Actions
  actions?: React.ReactNode;

  // Layout control
  sticky?: boolean;

  // Additional content
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  breadcrumbs,
  showBackButton = false,
  backButtonText,
  onBackClick,
  actions,
  sticky = false,
  children,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={cn(
        "bg-background border-b border-border py-4 mb-6",
        sticky && "sticky top-14 md:top-16 z-40 -mx-4 px-4",
        className
      )}
    >
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const ItemIcon = item.icon;

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>
                          {ItemIcon && (
                            <ItemIcon className="h-4 w-4 mr-1.5 inline" />
                          )}
                          {item.label}
                        </BreadcrumbPage>
                      ) : item.href ? (
                        <BreadcrumbLink to={item.href}>
                          {ItemIcon && (
                            <ItemIcon className="h-4 w-4 mr-1.5 inline" />
                          )}
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <span>
                          {ItemIcon && (
                            <ItemIcon className="h-4 w-4 mr-1.5 inline" />
                          )}
                          {item.label}
                        </span>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Back Button (if no breadcrumbs but showBackButton is true) */}
        {!breadcrumbs && showBackButton && (
          <div className="mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {backButtonText}
            </Button>
          </div>
        )}

        {/* Header content */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back button inline with title (when breadcrumbs exist) */}
              {breadcrumbs && showBackButton && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleBackClick}
                  className="shrink-0"
                  aria-label={backButtonText || "Voltar"}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              {Icon && <Icon className="h-6 w-6 shrink-0" />}

              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Children (badges, status, etc.) */}
            {children}
          </div>

          {/* Actions */}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
