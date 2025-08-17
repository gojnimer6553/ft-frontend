import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { account } from "@/lib/appwrite";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";

export const Route = createFileRoute("/__authenticationLayout/recover")({
  component: RecoverPage,
});

function RecoverPage() {
  const { t } = useTranslate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [success, setSuccess] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await account.createRecovery(
        email,
        `${window.location.origin}/recover`
      );
      setUserId(res.userId);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== passwordAgain) return;
      await account.updateRecovery(userId, otp, password);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted py-6 md:py-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">
                      {t("recover.title")}
                    </h1>
                  </div>
                  {!otpSent && !success && (
                    <form onSubmit={sendCode} className="flex flex-col gap-4">
                      <Input
                        type="email"
                        placeholder={t("login.email-placeholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button type="submit">{t("recover.sendCode")}</Button>
                    </form>
                  )}
                  {otpSent && !success && (
                    <form
                      onSubmit={resetPassword}
                      className="flex flex-col gap-4"
                    >
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Input
                        type="password"
                        placeholder={t("recover.newPassword")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Input
                        type="password"
                        placeholder={t("recover.confirmPassword")}
                        value={passwordAgain}
                        onChange={(e) => setPasswordAgain(e.target.value)}
                      />
                      <Button type="submit">{t("recover.submit")}</Button>
                    </form>
                  )}
                  {success && (
                    <div className="text-center text-sm">
                      <p>{t("recover.success")}</p>
                      <Link
                        to="/login"
                        className="underline underline-offset-4"
                      >
                        {t("recover.backToLogin")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="relative hidden bg-background md:flex md:items-center md:justify-center">
                <img
                  src="/assets/mascot/mascot_worried_face.png"
                  alt={t("recover.title")}
                  className="w-60 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RecoverPage;
