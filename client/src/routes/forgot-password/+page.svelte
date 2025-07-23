<!-- src/routes/forgot-password/+page.svelte -->
<script>
	// @ts-nocheck
	let email = '';
	let isLoading = false;
	let success = false;
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		success = false;
		isLoading = true;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/password-reset/request`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify({ email })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Erreur lors de l\'envoi');
			}
			success = true;
			email = '';
			
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Mot de passe oublié - GreenRoots</title>
	<meta name="description" content="Réinitialisez votre mot de passe GreenRoots en toute sécurité" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Jungle.png')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<!-- Content -->
	<div class="relative z-10 relative -mx-4 flex items-center justify-center px-4 pt-25 pb-40">
		<div class="max-w-md w-full">
			<!-- Card -->
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<!-- Header -->
				<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
					<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6h-7a6 6 0 01-6-6 6 6 0 016-6h7a6 6 0 016 6zM10 9v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2a1 1 0 00-1 1z"></path>
						</svg>
					</div>
					<h1 class="text-2xl font-bold text-white mb-2">Mot de passe oublié ?</h1>
					<p class="text-emerald-100">Pas de problème, nous allons vous aider</p>
				</div>

				<!-- Form -->
				<div class="p-8">
					{#if success}
						<!-- Success message -->
						<div class="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
							<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-green-800 mb-2">Email envoyé !</h3>
							<p class="text-green-700 text-sm mb-4">
								Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques minutes.
							</p>
							<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
								<p class="text-blue-700 text-xs">
									💡 <strong>Astuce :</strong> Vérifiez aussi vos dossiers spam/courrier indésirable
								</p>
							</div>
							<a href="/connexion" class="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
								</svg>
								<span>Retour à la connexion</span>
							</a>
						</div>
					{:else}
						<form on:submit|preventDefault={handleSubmit} class="space-y-6">
							<div class="text-center mb-6">
								<p class="text-gray-600 text-sm">
									Entrez votre adresse email et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
								</p>
							</div>

							<!-- Email input -->
							<div class="space-y-2">
								<label for="email" class="block text-sm font-semibold text-gray-700">
									Adresse email
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
										</svg>
									</div>
									<input
										bind:value={email}
										id="email"
										type="email"
										required
										placeholder="votre@email.com"
										class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
										disabled={isLoading}
									/>
								</div>
							</div>

							<!-- Error message -->
							{#if error}
								<div class="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
									<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									<p class="text-red-700 text-sm">{error}</p>
								</div>
							{/if}

							<!-- Submit button -->
							<button
								type="submit"
								disabled={isLoading}
								class="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{#if isLoading}
									<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span>Envoi en cours...</span>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
									</svg>
									<span>Envoyer le lien</span>
								{/if}
							</button>

							<!-- Security info -->
							<div class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
								<div class="flex items-start space-x-3">
									<svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									<div class="text-blue-700 text-sm">
										<p class="font-semibold mb-1">Sécurité garantie</p>
										<ul class="text-xs space-y-1">
											<li>• Le lien expire automatiquement dans 1 heure</li>
											<li>• Utilisable une seule fois uniquement</li>
											<li>• Aucune modification sans votre confirmation</li>
										</ul>
									</div>
								</div>
							</div>

							<!-- Back to login link -->
							<div class="text-center pt-4 border-t border-gray-100">
								<a href="/connexion" class="inline-flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
									</svg>
									<span>Retour à la connexion</span>
								</a>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>