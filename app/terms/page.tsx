import { AppShell } from "@/components/layout/app-shell";

export default function TermsPage() {
    return (
        <AppShell>
            <div className="max-w-2xl mx-auto space-y-8 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: January 2026</p>
                </div>
                <div className="prose dark:prose-invert">
                    <p>
                        Welcome to Clarity. By using our website, you agree to comply with and be bound by the following terms and conditions.
                    </p>
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using Clarity, you agree to these Terms of Service. If you do not agree, please do not use our services.
                    </p>
                    <h3>2. Use of Service</h3>
                    <p>
                        You agree to use Clarity for lawful purposes only and in a way that does not infringe the rights of others.
                    </p>
                    <h3>3. User Accounts</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your account and password.
                    </p>
                </div>
            </div>
        </AppShell>
    );
}
