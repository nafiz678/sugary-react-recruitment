import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
// import { Suspense, useEffect, useState } from "react";
// import api from "./router/AxiosInterceptor";
// import Skeleton from "./components/Skeleton";
// import axios from "axios";
import MaterialsList from "./components/Home/materials-list";
import { LoadingMaterials } from "./components/Home/loading-materials";
import { Suspense } from "react";
import { ModeToggle } from "./components/ui/theme/ModeToggle";


function App() {
  // const [materials, setMaterials] = useState([]);

  // useEffect(() => {
  //   const fetchMaterials = async () => {
  //     try {
  //       console.log(localStorage.getItem("accessToken"))
  //       const response = await axios.get('https://sugarytestapi.azurewebsites.net/Materials/GetAll/', {
  //         params: {
  //           filter: btoa(JSON.stringify({ Skip: 0, Limit: 20, Types: [1] })),
  //         },
  //       });
  //       console.log(response.data)
  //       setMaterials(response.data.Materials);
  //     } catch (error) {
  //       console.error('Error fetching materials:', error);
  //     }
  //   };

  //   fetchMaterials();
  // }, []);

  // console.log(materials)
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 bg-gray-50 dark:bg-black shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <ModeToggle />
          </header>
          <section className="min-h-screen bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Featured Materials</h1>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-10">
                Discover our curated collection of premium products
              </p>

              <Suspense fallback={<LoadingMaterials />}>
                <MaterialsList />
              </Suspense>
            </div>
          </section>
        </SidebarInset>
      </SidebarProvider>
    </main>
  )
}

export default App
