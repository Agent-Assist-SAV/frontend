import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </Link>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Politique de confidentialité
          </h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Collecte des données
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous collectons uniquement les données nécessaires au fonctionnement de notre service :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Informations de contact (nom, email, société)</li>
              <li>Messages envoyés via le formulaire de contact</li>
              <li>Données techniques (logs, métriques d'utilisation)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Utilisation des données
            </h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Vous contacter suite à votre demande de démo</li>
              <li>Améliorer notre service</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Hébergement et sécurité
            </h2>
            <p className="text-muted-foreground mb-4">
              Vos données sont hébergées en Union Européenne (OVHcloud) et protégées par :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Chiffrement des données en transit (TLS)</li>
              <li>Chiffrement des données au repos</li>
              <li>Accès restreint et audités</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Vos droits (RGPD)
            </h2>
            <p className="text-muted-foreground mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:dpo@agentassist.example.com" className="text-primary hover:underline">dpo@agentassist.example.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Conservation des données
            </h2>
            <p className="text-muted-foreground">
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, 
              et conformément aux obligations légales (3 ans maximum après le dernier contact).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement du service. 
              Aucun cookie de tracking publicitaire n'est utilisé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Contact
            </h2>
            <p className="text-muted-foreground">
              Pour toute question concernant cette politique de confidentialité, contactez-nous :
            </p>
            <ul className="list-none pl-0 text-muted-foreground mt-4 space-y-2">
              <li>Email : <a href="mailto:contact@agentassist.example.com" className="text-primary hover:underline">contact@agentassist.example.com</a></li>
              <li>DPO : <a href="mailto:dpo@agentassist.example.com" className="text-primary hover:underline">dpo@agentassist.example.com</a></li>
            </ul>
          </section>

          <p className="text-sm text-muted-foreground mt-12">
            Dernière mise à jour : Janvier 2025
          </p>
        </article>
      </div>
    </div>
  );
};

export default Confidentialite;
