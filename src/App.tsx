import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import MaterialsList from "./components/Home/materials-list";
import { LoadingMaterials } from "./components/Home/loading-materials";
import { Suspense, useContext, useEffect } from "react";
import { ModeToggle } from "./components/ui/theme/ModeToggle";
import { AuthContext } from "./provider/AuthProvider";


function App() {
  const context = useContext(AuthContext)
  const loading = context?.loading
  const isAuthenticated = context?.loading

    // You can add a redirect to login if not authenticated
    useEffect(() => {
      if ( !isAuthenticated) {
        // Redirect to login page
        // window.location.href = '/login';
        console.log('User is not authenticated, should redirect to login');
      }
    }, [loading, isAuthenticated]);

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
                Discover our collection of products
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
