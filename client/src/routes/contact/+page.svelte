<script>
// @ts-nocheck
	let nom = '';
	let prenom = '';
	let email = '';
	let content = '';
	let isLoading = false;
	let success = false;
	let error = '';

	async function handleSubmit(event) {
		event.preventDefault();		
		success = false;
		error = '';
		isLoading = true;
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify({ prenom, nom, email, content })
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.content || 'Erreur lors de l\'envoi du message');
			}
			success = data.content || 'Message envoyé avec succès !';
			nom = '';
			prenom = '';
			email = '';
			content = '';			
		} catch (err) {
			console.error('❌ Erreur:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<!-- Content Container -->
	<div class="relative z-10 container mx-auto px-4 pb-16">
			<!-- Header -->
		<div class="relative z-10 pt-20 pb-12">
			<div class="text-center">
				<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
					Nous Contacter
				</h1>
				<p class="text-lg text-gray-600 max-w-2xl mx-auto px-4">
					Une question ? Un projet de reforestation ? N'hésitez pas à nous écrire
				</p>
			</div>
		</div>
		<div class="max-w-4xl mx-auto">
			<!-- Breadcrumb -->
			<nav class="mb-8">
				<ol class="flex items-center justify-center space-x-2 text-sm text-gray-600">
					<li><a href="/" class="hover:text-green-600 transition-colors">Accueil</a></li>
					<li class="text-gray-400">›</li>
					<li class="text-gray-800 font-medium">Contact</li>
				</ol>
			</nav>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<!-- Contact Information -->
				<div class="space-y-8">
					<!-- Contact Info Card -->
					<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
						<h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
							<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor"
								viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
							<span>Informations de contact</span>
						</h2>

						<div class="space-y-6">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
									<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-gray-800 mb-1">Adresse</h3>
									<p class="text-gray-600 text-sm">
										1 rue de Navarre<br />
										75005 Paris<br />
										France
									</p>
								</div>
							</div>

							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
									<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-gray-800 mb-1">E-mail</h3>
									<a href="mailto:contact@greenroots.com" class="text-blue-600 hover:text-blue-700 text-sm">
										contact@greenroots.com
									</a>
								</div>
							</div>

							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
									<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										></path>
									</svg>
								</div>
								<div>
									<h3 class="font-semibold text-gray-800 mb-1">Téléphone</h3>
									<a href="tel:+33186220480" class="text-purple-600 hover:text-purple-700 text-sm">
										+33 (0)1 45 67 07 81
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Mission Card -->
					<div
						class="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 text-white">
						<h3 class="text-xl font-bold mb-4 flex items-center space-x-3">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								></path>
							</svg>
							<span>Notre mission</span>
						</h3>
						<p class="text-green-100 leading-relaxed">
							Agissez pour la planète, un arbre à la fois. Nous vous accompagnons dans vos projets
							de reforestation responsable pour un avenir plus vert.
						</p>
					</div>
				</div>

				<!-- Contact Form -->
				<div
					class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
					<!-- Form Header -->
					<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
						<h2 class="text-xl font-bold text-white flex items-center space-x-3">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
							</svg>
							<span>Envoyez-nous un message</span>
						</h2>
					</div>

					<!-- Form Content -->
					<form on:submit|preventDefault={handleSubmit} class="p-8 space-y-6">
						<!-- Name and First Name Row -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- Last Name -->
							<div class="space-y-2">
								<label for="nom" class="block text-sm font-semibold text-gray-700"> Nom * </label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
											</path>
										</svg>
									</div>
									<input
										bind:value={nom}
										id="nom"
										type="text"
										required
										placeholder="Votre nom"
										pattern="[A-Za-zÀ-ÿ\s\-']*"
										minlength="2"
										maxlength="30"
										class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
										disabled={isLoading}
									/>
								</div>
							</div>

							<!-- First Name -->
							<div class="space-y-2">
								<label for="prenom" class="block text-sm font-semibold text-gray-700">
									Prénom *
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											></path>
										</svg>
									</div>
									<input
										bind:value={prenom}
										id="prenom"
										type="text"
										required
										placeholder="Votre prénom"
										pattern="[A-Za-zÀ-ÿ\s\-']*"
										minlength="2"
										maxlength="30"
										class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
										disabled={isLoading}
									/>
								</div>
							</div>
						</div>

						<!-- Email -->
						<div class="space-y-2">
							<label for="email" class="block text-sm font-semibold text-gray-700">
								Adresse e-mail *
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
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

						<!-- Message -->
						<div class="space-y-2">
							<label for="content" class="block text-sm font-semibold text-gray-700">
								Votre message *
							</label>
							<div class="relative">
								<div class="absolute top-3 left-3 pointer-events-none">
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
									</svg>
								</div>
								<textarea
									bind:value={content}
									id="content"
									required
									placeholder="Décrivez votre projet, vos questions ou vos besoins..."
									minlength="10"
									maxlength="1000"
									rows="5"
									class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
									disabled={isLoading}
								></textarea>
							</div>
							<p class="text-xs text-gray-500">
								{content.length}/1000 caractères
							</p>
						</div>

						<!-- Success Message -->
						{#if success}
							<div class="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3">
								<svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								<p class="text-green-700 text-sm">
									{success}
								</p>
							</div>
						{/if}

						<!-- Error Message -->
						{#if error}
							<div class="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
								<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<p class="text-red-700 text-sm">{error}</p>
							</div>
						{/if}

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isLoading}
							class="cursor-pointer w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{#if isLoading}
								<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<span>Envoi en cours...</span>
							{:else}
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
								</svg>
								<span>Envoyer le message</span>
							{/if}
						</button>

						<!-- Privacy Notice -->
						<div class="text-center pt-4 border-t border-gray-100">
							<p class="text-gray-500 text-xs">
								Vos données sont protégées et ne seront utilisées que pour vous répondre.
								<a href="/mentions" class="text-green-600 hover:text-green-700 underline">
									Politique de confidentialité
								</a>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>