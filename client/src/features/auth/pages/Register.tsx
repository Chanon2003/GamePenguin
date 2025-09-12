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

// 🧠 1. สร้าง schema ด้วย zod
const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error จะแสดงที่ฟิลด์นี้
  })

export default function Register() {
  const navigate = useNavigate()
  // 🧠 2. ใช้ useForm จาก React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // 🧠 3. onSubmit
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: {
          email: data.email,
          password: data.password,
        },
      })
      const { data: responseData } = response;
      if (responseData.success && response.status === 201) {
        toast.dismiss();
        toast.success("Registration successful! Please check your email to verify your account.")
      }
      navigate("/login")
      // ทำ logic ส่งข้อมูลไป backend ที่นี่
    } catch (error: unknown) {
       toast.dismiss();
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
      } else {
        toast.error("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Register</h2>

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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  )
}
