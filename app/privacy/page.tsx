import { AppShell } from "@/components/layout/app-shell";

export default function PrivacyPage() {
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </div>
                <div className="prose dark:prose-invert">
                    <p>
                        At Clarity, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                    </p>
                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect minimal information necessary to provide our services, such as your email address and basic profile information when you authenticate.
                    </p>
                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use your information to personalize your experience, save your progress, and improve our platform.
                    </p>
                    <h3>3. Data Protection</h3>
                    <p>
                        Your data is stored securely and we do not sell your personal information to third parties.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
