<script>
	let showPassword = false;
	let passwordInput;
	let motDePasseInvalide = false;
	let nom = '';
	let prenom = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let success = '';

	// @ts-ignore
	async function registerSubmit(event) {
		event.preventDefault();

		if (password !== confirmPassword) {
			motDePasseInvalide = true;
			return;
		}
		motDePasseInvalide = false;
		error = '';
		success = '';

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstname: prenom,
					lastname: nom,
					email,
					password
				})
			});
			const data = await res.json();
			if (res.ok) {
				success = 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.';
			} else {
				error = data.error || "Erreur lors de l'inscription";
			}
		} catch (e) {
			error = "Erreur lors de l'inscription 2";
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>

	<div class="relative z-10 container mx-auto px-4">
		<div class="max-w-md mx-auto">
			<!-- Header -->
			<div class="relative z-10 pt-20">
				<div class="text-center mb-8">
					<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
						Inscription
					</h1>
					<p class="text-gray-600">Rejoignez la communauté GreenRoots</p>
				</div>
			</div>
			<!-- Registration Form -->
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<!-- Form Header -->
				<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
					<h2 class="text-xl font-bold text-white flex items-center space-x-3">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
						</svg>
						<span>Créer votre compte</span>
					</h2>
				</div>

				<!-- Form Content -->
				<form on:submit={registerSubmit} class="p-8 space-y-6">
					<!-- Name and First Name Row -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Last Name -->
						<div class="space-y-2">
							<label for="nom" class="block text-sm font-semibold text-gray-700"> Nom * </label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
										</path>
									</svg>
								</div>
								<input
									bind:value={nom}
									id="nom"
									type="text"
									required
									placeholder="Votre nom"
									pattern="[A-Za-z][A-Za-z0-9\-]*"
									minlength="2"
									maxlength="30"
									class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
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
									pattern="[A-Za-z][A-Za-z0-9\-]*"
									minlength="2"
									maxlength="30"
									class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
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
							/>
						</div>
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="block text-sm font-semibold text-gray-700">
							Mot de passe *
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									></path>
								</svg>
							</div>
							<input
								bind:value={password}
								bind:this={passwordInput}
								id="password"
								type={showPassword ? 'text' : 'password'}
								required
								placeholder="Mot de passe"
								minlength="8"
								class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
							/>
							<button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" on:click={() => (showPassword = !showPassword)}>
								{#if showPassword}
									<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
										></path>
									</svg>
								{:else}
									<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										></path>
									</svg>
								{/if}
							</button>
						</div>
						<p class="text-xs text-gray-500 mt-1">
							Au moins 8 caractères, avec majuscules, minuscules et chiffres
						</p>
					</div>

					<!-- Confirm Password -->
					<div class="space-y-2">
						<label for="confirmPassword" class="block text-sm font-semibold text-gray-700">
							Confirmer le mot de passe *
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									></path>
								</svg>
							</div>
							<input
								bind:value={confirmPassword}
								id="confirmPassword"
								type={showPassword ? 'text' : 'password'}
								required
								placeholder="Confirmer le mot de passe"
								class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
								class:border-red-300={motDePasseInvalide}
								class:focus:ring-red-500={motDePasseInvalide}
							/>
						</div>
						{#if motDePasseInvalide}
							<p class="text-red-500 text-sm flex items-center space-x-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<span>Les mots de passe ne correspondent pas</span>
							</p>
						{/if}
					</div>

					<!-- Show Password Toggle -->
					<div class="flex items-center space-x-3">
						<input type="checkbox" id="showpassword" bind:checked={showPassword} class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"/>
						<label for="showpassword" class="text-sm text-gray-600 cursor-pointer">
							Afficher les mots de passe
						</label>
					</div>

					<!-- Error Message -->
					{#if error}
						<div class="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
							<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<p class="text-red-700 text-sm">{error}</p>
						</div>
					{/if}

					<!-- Success Message -->
					{#if success}
						<div class="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3">
							<svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
							<p class="text-green-700 text-sm">{success}</p>
						</div>
					{/if}

					<!-- Submit Button -->
					<button type="submit"
						class="cursor-pointer w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
							></path>
						</svg>
						<span>Créer mon compte</span>
					</button>

					<!-- Login Link -->
					<div class="text-center pt-4 border-t border-gray-100">
						<p class="text-gray-600 text-sm">
							Vous avez déjà un compte ?
							<a href="/connexion" class="text-green-600 hover:text-green-700 font-semibold underline">
								Se connecter
							</a>
						</p>
					</div>
				</form>
			</div>

			<!-- Additional Info -->
			<div class="mt-8 text-center pb-20">
				<p class="text-gray-500 text-sm">
					En créant votre compte, vous acceptez nos
					<a href="/mentions" class="text-green-600 hover:text-green-700 underline">
						conditions d'utilisation
					</a>
					et notre
					<a href="/mentions" class="text-green-600 hover:text-green-700 underline">
						politique de confidentialité
					</a>.
				</p>
			</div>
		</div>
	</div>
</div>
