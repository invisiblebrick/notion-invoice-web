"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Rocket,
  Zap,
  Shield,
  Code2,
  Palette,
  Smartphone,
  ArrowRight,
  Github,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface FeatureExample {
  icon: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode;
}

const features: FeatureExample[] = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Next.js 15",
    description: "App Router 기반의 최신 Next.js",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Next.js 15의 App Router를 사용한 파일 기반 라우팅 예시:
        </p>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-muted-foreground">// app/page.tsx</div>
          <div className="text-blue-600">export default function</div>
          <div className="pl-4">Page() {'{'}</div>
          <div className="pl-8">return &lt;h1&gt;홈페이지&lt;/h1&gt;;</div>
          <div className="pl-4">{'}'}</div>
        </div>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm">
          <div className="text-muted-foreground">// app/blog/[slug]/page.tsx</div>
          <div className="text-purple-600">{'// 동적 라우팅 예시'}</div>
        </div>
      </div>
    ),
  },
  {
    icon: <Palette className="h-6 w-6" />,
    title: "TailwindCSS v4",
    description: "CSS 기반 설정, config 파일 없음",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          TailwindCSS v4의 CSS 기반 설정 예시:
        </p>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-green-600">@import "tailwindcss";</div>
          <br />
          <div className="text-purple-600">@theme inline {'{'}</div>
          <div className="pl-4 text-blue-600">--color-primary:</div>
          <div className="pl-8">var(--primary);</div>
          <div className="pl-4 text-blue-600">--color-secondary:</div>
          <div className="pl-8">var(--secondary);</div>
          <div className="text-purple-600">{'}'}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm font-medium mb-2">유틸리티 클래스 예시:</div>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">bg-primary</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">hover:scale-110</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">md:flex-row</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: "TypeScript",
    description: "타입 안전한 개발 환경",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          TypeScript를 활용한 타입 안전한 코드 예시:
        </p>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div className="text-blue-600">interface</div>
          <div className="pl-4">User {'{'}</div>
          <div className="pl-8">id: number;</div>
          <div className="pl-8">name: string;</div>
          <div className="pl-8">email?: string;</div>
          <div className="pl-4">{'}'}</div>
          <br />
          <div className="text-purple-600">function</div>
          <div className="pl-4">getUser(id: number): Promise&lt;User&gt; {'{'}</div>
          <div className="pl-8">{/* ... */}</div>
          <div className="pl-4">{'}'}</div>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>컴파일 타임 오류 방지</span>
        </div>
      </div>
    ),
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "shadcn/ui",
    description: "재사용 가능한 UI 컴포넌트",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          shadcn/ui 컴포넌트 사용 예시:
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button size="sm">Button</Button>
            <span className="text-xs text-muted-foreground">&lt;Button&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge>Badge</Badge>
            <span className="text-xs text-muted-foreground">&lt;Badge&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Input example"
              className="w-40"
              readOnly
            />
            <span className="text-xs text-muted-foreground">&lt;Input&gt;</span>
          </div>
        </div>
        <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
          npx shadcn@latest add [component]
        </div>
      </div>
    ),
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "반응형 디자인",
    description: "모든 디바이스에서 완벽하게",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          TailwindCSS 반응형 클래스 예시:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">모바일 (기본)</div>
            <div className="h-16 bg-blue-100 rounded flex items-center justify-center text-xs">
              w-full
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">태블릿 (md:)</div>
            <div className="h-16 bg-green-100 rounded flex items-center justify-center text-xs">
              md:w-1/2
            </div>
          </div>
        </div>
        <div className="bg-muted p-4 rounded-lg font-mono text-sm">
          <div className="text-purple-600">&lt;div className="</div>
          <div className="pl-4">grid grid-cols-1</div>
          <div className="pl-4">md:grid-cols-2</div>
          <div className="pl-4">lg:grid-cols-3</div>
          <div className="text-purple-600">"&gt;</div>
        </div>
      </div>
    ),
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "ESLint",
    description: "코드 품질 유지",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          ESLint로 코드 품질을 유지하는 예시:
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <X className="h-4 w-4 text-red-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-red-800">오류</div>
              <div className="text-xs text-red-600">Unexpected var, use let or const</div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-green-800">정상</div>
              <div className="text-xs text-green-600">const user = {'{'} name: &quot;Kim&quot; {'}'};</div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-yellow-800">경고</div>
              <div className="text-xs text-yellow-600">Unused variable</div>
            </div>
          </div>
        </div>
        <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
          npm run lint
        </div>
      </div>
    ),
  },
];

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureExample | null>(
    null
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Login Button */}
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <Link href="/login">
          <Button variant="outline" size="sm">Login</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="text-sm">
              v1.0.0
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Next.js Starter Kit
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Next.js v15 + TailwindCSS v4 + shadcn/ui + TypeScript
              <br />
              빠른 웹 개발을 위한 스타터킷
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              시작하기
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => {
                window.open("https://github.com", "_blank", "noopener,noreferrer");
              }}
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">기술 스택</h2>
          <p className="text-muted-foreground">
            현대적인 웹 개발을 위한 최고의 도구들
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
              onClick={() => setSelectedFeature(feature)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Component Showcase */}
      <section id="showcase" className="container mx-auto px-4 py-24 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">컴포넌트 예시</h2>
          <p className="text-muted-foreground">
            shadcn/ui 컴포넌트 사용 예시
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>다양한 버튼 스타일</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>다양한 배지 스타일</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>© 2025 Next.js Starter Kit. Built with Next.js + TailwindCSS + shadcn/ui</p>
      </footer>

      {/* Feature Detail Dialog */}
      <Dialog
        open={selectedFeature !== null}
        onOpenChange={() => setSelectedFeature(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {selectedFeature?.icon}
              </div>
              <div>
                <DialogTitle>{selectedFeature?.title}</DialogTitle>
                <DialogDescription>
                  {selectedFeature?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="mt-4">{selectedFeature?.content}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
