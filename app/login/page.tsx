"use client";

import Image from "next/image";
import { Button } from "../_components/ui/button";
import { FaGithub } from "react-icons/fa";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const handleGithubLogin = () => {
    signIn("github");
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <div className="grid h-full grid-cols-2">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <Image
          src="/logo.svg"
          width={173}
          height={39}
          alt="Finance AI"
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Bem-vindo</h1>
        <p className="mb-8 text-muted-foreground">
          A Finance AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>

    
        <Button variant="outline" onClick={handleGithubLogin} className="mb-4" aria-label="Login com GitHub">
          <FaGithub className="mr-2" />
          Login com GitHub
        </Button>

  
        <Button variant="outline" onClick={handleGoogleLogin} className="mb-4" aria-label="Login com Google">
          <AiOutlineGoogle className="mr-2" />
          Login com Google
        </Button>
      </div>

      <div className="relative h-full w-full">
        <Image
          src="/login.png"
          alt="Faça login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
