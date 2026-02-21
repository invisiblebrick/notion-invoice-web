import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            계정에 로그인하여 서비스를 이용하세요
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit">
              로그인하기
            </Button>
          <p className="text-sm text-muted-foreground text-center">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              회원가입
            </Link>
          </p>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
}
