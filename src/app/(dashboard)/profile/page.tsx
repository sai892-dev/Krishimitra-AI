import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { DEMO_USERS } from "@/lib/data/seed";
import { AP_CROPS } from "@/lib/constants/ap";
import { LANGUAGES_LIST } from "@/lib/i18n/translations";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  const demoUser = profile
    ? Object.values(DEMO_USERS).find((u) => u.id === profile.id)
    : null;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Farmer Profile" subtitle="Your farming details for personalized recommendations" />

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-2xl font-semibold text-white">
            {profile?.full_name?.charAt(0) ?? "?"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-forest-dark">{profile?.full_name}</h2>
            <p className="text-sm text-stone-500">{profile?.phone ?? profile?.district}</p>
            <Badge className="mt-1">{profile?.role}</Badge>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-stone-500 uppercase">District</dt>
            <dd className="font-medium">{profile?.district ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase">State</dt>
            <dd className="font-medium">{profile?.state ?? "Andhra Pradesh"}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase">Language</dt>
            <dd className="font-medium">
              {LANGUAGES_LIST.find((l) => l.code === profile?.preferred_language)?.name ?? profile?.preferred_language}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500 uppercase">Phone</dt>
            <dd className="font-medium">{profile?.phone ?? "—"}</dd>
          </div>
          {demoUser?.farmer && (
            <>
              <div>
                <dt className="text-xs text-stone-500 uppercase">Land size</dt>
                <dd className="font-medium">{demoUser.farmer.land_size_acres} acres</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500 uppercase">Village / Mandal</dt>
                <dd className="font-medium">
                  {demoUser.farmer.village}, {demoUser.farmer.mandal}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-stone-500 uppercase mb-1">Primary crops</dt>
                <dd className="flex flex-wrap gap-2">
                  {demoUser.farmer.primary_crops.map((c) => {
                    const crop = AP_CROPS.find((ac) => ac.value === c);
                    return (
                      <Badge key={c}>
                        {crop ? `${crop.en} (${crop.te})` : c}
                      </Badge>
                    );
                  })}
                </dd>
              </div>
            </>
          )}
        </dl>
      </Card>
    </div>
  );
}
