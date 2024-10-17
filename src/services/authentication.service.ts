import { User } from "../models/user.model"; // Modèle Sequelize
import jwt from "jsonwebtoken"; // Pour générer le JWT
import { Buffer } from "buffer"; // Pour décoder Base64
import { notFound } from "../error/NotFoundError";

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Clé secrète pour signer le token

export class AuthenticationService {
  public async authenticate(
    username: string,
    password: string
  ): Promise<string> {
    // Recherche l'utilisateur dans la base de données
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw notFound("User");
    }

    // Décoder le mot de passe stocké en base de données
    const decodedPassword = Buffer.from(user.password, "base64").toString(
      "utf-8"
    );

    // Vérifie si le mot de passe est correct
    if (password === decodedPassword) {
      // Définit les scopes JWT en fonction du rôle de l'utilisateur
      let jtwScopes: string[];
      switch (user.role) {
        case "admin":
          jtwScopes = [
            "read:user",
            "create:user",
            "update:user",
            "delete:user",
            "read:book",
            "create:book",
            "update:book",
            "delete:book",
            "read:author",
            "create:author",
            "update:author",
            "delete:author",
            "read:collection",
            "create:collection",
            "update:collection",
            "delete:collection",
          ];
          break;
        case "user":
          jtwScopes = [
            "read:book",
            "create:book",
            "read:author",
            "read:collection",
          ];
          break;
        case "manager":
            jtwScopes = [
              "read:book",
              "create:book",
              "update:book",
              "read:author",
              "create:author",
              "update:author",
              "read:collection",
              "create:collection",
              "update:collection",
              "delete:collection",
            ];
            break;
        default:
          jtwScopes = [];
      }

      // Si l'utilisateur est authentifié, on génère un JWT
      const token = jwt.sign({ username: user.username, scopes: jtwScopes }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return token;
    } else {
      let error = new Error("Wrong password");
      (error as any).status = 403;
      throw error;
    }
  }
}

export const authService = new AuthenticationService();
