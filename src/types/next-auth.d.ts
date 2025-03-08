import { DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User {
    phoneNumber?: string | null;
    isAdmin: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phoneNumber?: string | null;
      isAdmin: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    phoneNumber: string | null | undefined;
    isAdmin: boolean;
  }
}
