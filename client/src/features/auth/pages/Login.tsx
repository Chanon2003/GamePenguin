import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import SummaryApi from "@/common/SummaryApi"
import Axios from "@/utils/Axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { AppDispatch } from "@/store/store"
import { useDispatch } from "react-redux"
import { setUserDetails } from "@/store/userSlice"

// 🧠 1. สร้าง schema ด้วย zod
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector((state: RootState) => state.user);
  console.log('user from store', user);

  // 🧠 2. ใช้ useForm จาก React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 🧠 3. onSubmit
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Login data:", data)
      const response = await Axios({
        ...SummaryApi.login, // เปลี่ยนเป็น API login
        data: {
          email: data.email,
          password: data.password,
        },
      })


      const { data: responseData } = response
      if (responseData.success && response.status === 200 && responseData.users) {
        
        console.log('responseData',responseData.users)
        toast.dismiss()
        dispatch(setUserDetails(responseData.users)) // ส่งตรง object
        toast.success("Login successful!")
        navigate("/")
      } else {
        toast.error("Login failed: data not found")
      }
    } catch (error: unknown) {
      console.log('error', error)
      toast.dismiss()
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด")
      } else {
        toast.error("เกิดข้อผิดพลาดบางอย่าง")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </div>
  )
}
