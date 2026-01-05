import AuthLayout from "@/features/auth/components/auth-layout";

const Layout = ({children}) => {
    return ( 
              <AuthLayout>{children}</AuthLayout>
     );
}
 
export default Layout;