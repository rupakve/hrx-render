//src/pages/index.tsx
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import Navbar from "@/components/dashboard/Navbar";
import FilterBar from "@/components/dashboard/FilterBar";
import AIAssistantCard from "@/components/dashboard/AIAssistantCard";
import NextSteps from "@/components/dashboard/NextStepsCard";
import PopularTopics from "@/components/dashboard/PopularTopics";
import RecommendedForYou from "@/components/dashboard/RecommendedForYou";
import SidePanel from "@/components/dashboard/SidePanel";
import { ChatResponse, WidgetData } from "@/types/chat";
import AIResponsePanel from "@/components/dashboard/AIResponsePanel";
//import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [userEmail, setUserEmail] = useState("");
  //const navigate = useNavigate();
  const [aiResponse, setAiResponse] = useState<ChatResponse | null>(null);
  //const { isAuthenticated, loading } = useAuth();
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 1200);
  }, []);

  if (loadingPage) {
    return (
      <div className="min-h-screen rounded-[25px]">
        <main
          className="w-full 
        max-w-[1140px] 
        xl:max-w-[1140px] 
        lg:max-w-[960px] 
        md:max-w-[720px] 
        sm:max-w-[540px] 
        mx-auto
        rounded-[25px] 
        border-4 border-white
        p-[3px] 
        relative 
        overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-[3px] bg-gradient-to-br from-[hsl(163_40%_17%)] via-[hsl(160_30%_5%)] to-[hsl(163_40%_17%)] rounded-[23px]" />

          <div className="relative z-10 rounded-[25px]">
            {/* Navbar Skeleton */}
            <div className="flex justify-between items-center px-6 py-4">
              <Skeleton className="h-8 w-32 bg-white/5" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-24 rounded-full bg-white/5" />
                <Skeleton className="h-8 w-8 rounded-full bg-white/5" />
              </div>
            </div>

            <section className="p-4 md:p-6 space-y-6">
              {/* Filter Bar */}
              <div className="flex gap-3 flex-wrap">
                <Skeleton className="h-10 w-40 rounded-full bg-white/5" />
                <Skeleton className="h-10 w-48 rounded-full bg-white/5" />
                <Skeleton className="h-10 w-44 rounded-full bg-white/5" />
              </div>

              {/* AI Assistant */}
              <Skeleton className="h-28 w-full rounded-2xl bg-white/10 animate-pulse" />

              {/* Section Titles */}
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-40 bg-white/5 rounded" />
                <Skeleton className="h-5 w-40 bg-white/5 rounded hidden lg:block" />
              </div>

              <div className="flex flex-col lg:flex-row gap-6 mt-2">
                {/* LEFT */}
                <div className="flex-1 min-w-0 space-y-6">
                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-44 rounded-2xl bg-white/10 animate-pulse"
                      />
                    ))}
                  </div>

                  {/* Popular Topics */}
                  <Skeleton className="h-44 w-full rounded-2xl bg-white/10" />

                  {/* Recommended */}
                  <Skeleton className="h-44 w-full rounded-2xl bg-white/10" />
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-4">
                  <Skeleton className="h-44 rounded-2xl bg-white/10 animate-pulse" />
                  <Skeleton className="h-44 rounded-2xl bg-white/10 animate-pulse" />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-[25px]">
      {" "}
      {/* bg-background */}
      <main
        className=" w-full 
        max-w-[1140px] 
        xl:max-w-[1140px] 
        lg:max-w-[960px] 
        md:max-w-[720px] 
        sm:max-w-[540px] 
        mx-auto
        rounded-[25px] 
        border-4 border-white
        bg-gradient-to-b from-white/5 to-transparent 
        p-[3px] 
        relative 
        overflow-hidden"
      >
        {/* Inner gradient background */}
        <div className="absolute inset-[3px] bg-gradient-to-br from-[hsl(163_40%_17%)] via-[hsl(160_30%_5%)] to-[hsl(163_40%_17%)] rounded-[23px]" />

        <div className="relative z-10 rounded-[25px]">
          <Navbar />

          <section className="p-4 md:p-6">
            <FilterBar />
            {/* <AIAssistantCard onResponse={setAiResponse} /> */}
            <AIAssistantCard />
            <div className="flex flex-col lg:flex-row gap-6 mt-2">
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="transition-all duration-300 ease-in-out">
                  <NextSteps />

                  <PopularTopics />
                  <RecommendedForYou />
                </div>
              </div>

              {/* Right sidebar */}
              <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0">
                <SidePanel />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
