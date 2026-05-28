import CallTable from "@/features/calls/components/Tabs/CallTable";
import RecurringCallTable from "@/features/calls/components/Tabs/RecurringCallTable";
import { useEffect, useRef, useState } from "react";
import { Call } from "@/types/api/calls";
import { SideStatsCard } from "@/features/calls/components/SideStatsCard";
import { useUser } from "@/features/auth/hooks/useUser";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CallsTab } from "@/features/calls/components/CallsTopBar";

const CALLS_DOCKED_MIN_CONTAINER_WIDTH = 1800;

export default function CallsPage() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [activeTab, setActiveTab] = useState<CallsTab>("active");
  const { allUsers } = useUser();
  const pageLayoutRef = useRef<HTMLDivElement | null>(null);
  const [isDockedDetails, setIsDockedDetails] = useState(true);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  useEffect(() => {
    const updateByWidth = (width: number) => {
      const shouldDock = width >= CALLS_DOCKED_MIN_CONTAINER_WIDTH;
      setIsDockedDetails(shouldDock);
      if (shouldDock) {
        setIsMobileDetailsOpen(false);
      }
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      updateByWidth(entry.contentRect.width);
    });

    if (pageLayoutRef.current) {
      observer.observe(pageLayoutRef.current);
      updateByWidth(pageLayoutRef.current.getBoundingClientRect().width);
    }

    return () => observer.disconnect();
  }, []);

  const handleSelectCall = (call: Call | null) => {
    setSelectedCall(call);
    if (!isDockedDetails && call) {
      setIsMobileDetailsOpen(true);
    }
  };

  return (
    <div ref={pageLayoutRef} className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col min-w-0">
        {activeTab === "active" ? (
          <CallTable
            selectedCall={selectedCall}
            onSelect={handleSelectCall}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : (
          <RecurringCallTable
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>

      {isDockedDetails ? (
        <SideStatsCard
          call={selectedCall}
          users={allUsers}
          className="w-[350px] flex-shrink-0 h-full overflow-hidden"
        />
      ) : (
        <Sheet open={isMobileDetailsOpen} onOpenChange={setIsMobileDetailsOpen}>
          <SheetContent
            side="left"
            className="w-[92vw] max-w-[420px] p-0 border-0 bg-transparent shadow-none"
          >
            <SideStatsCard
              call={selectedCall}
              users={allUsers}
              className="h-full rounded-none"
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
