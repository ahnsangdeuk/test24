import { LoginForm } from '@/components/login-form'; // LoginForm 컴포넌트를 임포트합니다 (곧 생성 예정).

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-heading">
          로그인
        </h1>
        <LoginForm />
      </div>
    </div>
  );
} 