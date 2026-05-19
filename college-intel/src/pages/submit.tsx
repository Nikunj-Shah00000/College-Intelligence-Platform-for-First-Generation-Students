import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTip } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldAlert, Send } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Please provide more details"),
  category: z.string().min(1, "Select a category"),
  urgency: z.string().min(1, "Select urgency level"),
  college: z.string().min(2, "Enter college name"),
  branch: z.string().min(2, "Enter branch name"),
  deadline: z.string().optional(),
});

export default function Submit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createTip = useCreateTip();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      urgency: "medium",
      college: "",
      branch: "",
      deadline: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTip.mutate(
      {
        data: {
          ...values,
          authorId: 1, // hardcoded for demo
        },
      },
      {
        onSuccess: (data) => {
          toast({
            title: "Intel Submitted",
            description: "Your tip is now live on the network.",
          });
          setLocation(`/tip/${data.id}`);
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Transmission Failed",
            description: "Could not submit intel. Try again.",
          });
        },
      }
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono tracking-tight flex items-center gap-3">
          <ShieldAlert className="text-primary" size={32} />
          SUBMIT INTEL
        </h1>
        <p className="text-muted-foreground mt-2 font-mono text-sm">
          Share undocumented institutional knowledge. Be precise. Be factual.
        </p>
      </div>

      <div className="bg-card border border-border p-6 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground uppercase">SUBJECT / TITLE</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CS401 Midterm format change" className="font-mono bg-secondary/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground uppercase">CATEGORY</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-mono bg-secondary/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="faculty">Faculty Quirks</SelectItem>
                        <SelectItem value="department">Dept Norms</SelectItem>
                        <SelectItem value="placement">Placement Pipelines</SelectItem>
                        <SelectItem value="scholarship">Hidden Scholarships</SelectItem>
                        <SelectItem value="club">Club Politics</SelectItem>
                        <SelectItem value="general">General Survival</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground uppercase">URGENCY</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-mono bg-secondary/50">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">CRITICAL (Action Req Today)</SelectItem>
                        <SelectItem value="high">HIGH (Action Req This Week)</SelectItem>
                        <SelectItem value="medium">MEDIUM (Good to know)</SelectItem>
                        <SelectItem value="low">LOW (Background info)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground uppercase">INSTITUTION</FormLabel>
                    <FormControl>
                      <Input placeholder="College Name" className="font-mono bg-secondary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-xs text-muted-foreground uppercase">DEPARTMENT/BRANCH</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" className="font-mono bg-secondary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground uppercase">FULL DEBRIEF</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detail the exact situation, consequences, and required actions..." 
                      className="min-h-[150px] font-mono text-sm bg-secondary/50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono text-xs text-muted-foreground uppercase">DEADLINE (IF ANY)</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="font-mono bg-secondary/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t border-border">
              <Button type="submit" disabled={createTip.isPending} className="font-mono w-full md:w-auto">
                {createTip.isPending ? (
                  "TRANSMITTING..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    BROADCAST INTEL
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
