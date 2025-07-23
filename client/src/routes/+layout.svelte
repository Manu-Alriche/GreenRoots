<script>
	// @ts-nocheck
	import '../app.css';
    import { NavBar, Footer } from '$lib/components';
	import { page } from '$app/stores';
    
    const pageTitles = {
        '/': 'Accueil',
        '/produits': 'Nos Arbres',
        '/panier': 'Panier',
        '/contact': 'Contact',
        '/connexion': 'Connexion',
        '/inscription': 'Inscription',
        '/profil': 'Mon Profil',
		'/forgot-password': 'Password Oublié',
		'/mentions': 'Mentions Légales',
		'/apropos': 'A propos de nous',
		'/panier/sucess': 'Commande Validée'
    };
    
    $: pageTitle = pageTitles[$page.route?.id] || 'Page';	
</script>

<svelte:head>
    <title>GreenRoots | {pageTitle}</title>
    <meta name="description" content="GreenRoots - Votre partenaire pour la planète" />
</svelte:head>

<NavBar />

<main class="pt-20 relative mx-auto max-w-[85rem]">
	<slot />
</main>

<Footer />
