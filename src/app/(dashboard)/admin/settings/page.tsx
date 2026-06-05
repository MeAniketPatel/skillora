import { requireAdmin } from "@/shared/lib/auth-helpers";
import { getAllSettings } from "@/features/settings/server";
import { updateSetting } from "@/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getAllSettings();

  const keys = [
    { key: "SITE_NAME", label: "Site Name", default: "Skillora" },
    { key: "PLATFORM_FEE_PERCENTAGE", label: "Platform Fee (%)", default: "15" },
    { key: "ALLOW_REGISTRATION", label: "Allow New Registrations (true/false)", default: "true" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">Manage global configuration for the application.</p>
      </div>

      <div className="grid gap-6">
        {keys.map((k) => (
          <Card key={k.key}>
            <CardHeader>
              <CardTitle className="text-lg">{k.label}</CardTitle>
              <CardDescription>Key: {k.key}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={async (formData) => {
                "use server";
                await updateSetting({ key: k.key, value: formData.get("value") });
              }} className="flex items-center gap-4">
                <input 
                  name="value" 
                  defaultValue={settings[k.key] || k.default}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                  required
                />
                <Button type="submit">Save</Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
