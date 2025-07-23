<!-- src/routes/reset-password/+page.svelte -->
<script>
    // @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let token = '';
	let newPassword = '';
	let confirmPassword = '';
	let isLoading = false;
	let isVerifying = true;
	let success = false;
	let error = '';
	let tokenValid = false;
	let userEmail = '';
	let showPassword = false;
	let showConfirmPassword = false;

	$: passwordValid = newPassword.length >= 8;
	$: passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
	$: canSubmit = passwordValid && passwordsMatch && !isLoading;

	onMount(async () => {
		token = $page.url.searchParams.get('token') || '';
		
		if (!token) {
			error = 'Token manquant dans l\'URL';
			isVerifying = false;
			return;
		}
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/password-reset/verify/${token}`);
			const data = await res.json();

			if (res.ok) {
				tokenValid = true;
				userEmail = data.email;
			} else {
				error = data.message || 'Token invalide';
			}
		} catch (err) {
			error = 'Erreur lors de la vérification du token';
		} finally {
			isVerifying = false;
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		isLoading = true;

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/password-reset/reset`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify({ token, newPassword })
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || 'Erreur lors du reset');
			}

			success = true;
            setTimeout(() => {
				goto('/connexion');
			}, 1000);
			
		} catch (err) {
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	function togglePassword(field) {
		if (field === 'new') {
			showPassword = !showPassword;
		} else {
			showConfirmPassword = !showConfirmPassword;
		}
	}
</script>

<svelte:head>
	<title>Nouveau mot de passe - GreenRoots</title>
	<meta name="description" content="Créez votre nouveau mot de passe GreenRoots" />
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
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6h-7a6 6 0 01-6-6 6 6 0 016-6h7a6 6 0 016 6z"></path>
						</svg>
					</div>
					<h1 class="text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
					<p class="text-emerald-100">Créez un mot de passe sécurisé pour votre compte</p>
				</div>

				<!-- Content -->
				<div class="p-8">
					{#if isVerifying}
						<!-- Loading state -->
						<div class="text-center py-8">
							<svg class="animate-spin w-12 h-12 mx-auto text-green-600 mb-4" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<p class="text-gray-600">Vérification du lien de sécurité...</p>
						</div>
					{:else if success}
						<!-- Success message -->
						<div class="text-center py-8">
							<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-800 mb-2">Mot de passe modifié !</h3>
							<p class="text-gray-600 mb-4">
								Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
							</p>
							<div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
								<p class="text-green-700 text-sm">
									🎉 <strong>Parfait !</strong> Vous allez être redirigé vers la page de connexion dans quelques secondes.
								</p>
							</div>
							<a href="/connexion" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
								<span>Se connecter maintenant</span>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</a>
						</div>
					{:else if !tokenValid}
						<!-- Invalid token -->
						<div class="text-center py-8">
							<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-800 mb-2">Lien invalide ou expiré</h3>
							<p class="text-gray-600 mb-6">{error}</p>
							<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
								<p class="text-yellow-700 text-sm">
									<strong>Que faire ?</strong><br>
									• Le lien expire après 1 heure<br>
									• Chaque lien ne peut être utilisé qu'une seule fois<br>
									• Demandez un nouveau lien si nécessaire
								</p>
							</div>
							<a href="/forgot-password" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
								<span>Demander un nouveau lien</span>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
							</a>
						</div>
					{:else}
						<!-- Reset form -->
						<form on:submit|preventDefault={handleSubmit} class="space-y-6">
							{#if userEmail}
								<div class="bg-gray-50 rounded-2xl p-4 text-center">
									<p class="text-sm text-gray-600">Nouveau mot de passe pour : <span class="font-semibold text-green-600">{userEmail}</span></p>
								</div>
							{/if}

							<!-- New password -->
							<div class="space-y-2">
								<label for="newPassword" class="block text-sm font-semibold text-gray-700">
									Nouveau mot de passe
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-6 6h-7a6 6 0 01-6-6 6 6 0 016-6h7a6 6 0 016 6z"></path>
										</svg>
									</div>
									<input
										bind:value={newPassword}
										id="newPassword"
										type={showPassword ? 'text' : 'password'}
										required
										placeholder="Minimum 8 caractères"
										minlength="8"
										class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
										disabled={isLoading}
									/>
									<button type="button" on:click={() => togglePassword('new')} class="absolute inset-y-0 right-0 pr-3 flex items-center">
										<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											{#if showPassword}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
											{:else}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
											{/if}
										</svg>
									</button>
								</div>
								<!-- Password strength indicator -->
								<div class="flex items-center space-x-2 mt-2">
									<div class="flex-1 bg-gray-200 rounded-full h-2">
										<div class="h-2 rounded-full transition-all duration-300 {passwordValid ? 'bg-green-500 w-full' : newPassword.length > 0 ? 'bg-yellow-500 w-1/2' : 'w-0'}"></div>
									</div>
									<span class="text-xs {passwordValid ? 'text-green-600' : newPassword.length > 0 ? 'text-yellow-600' : 'text-gray-400'}">
										{passwordValid ? 'Fort' : newPassword.length > 0 ? 'Faible' : ''}
									</span>
								</div>
							</div>

							<!-- Confirm password -->
							<div class="space-y-2">
								<label for="confirmPassword" class="block text-sm font-semibold text-gray-700">
									Confirmer le mot de passe
								</label>
								<div class="relative">
									<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
									</div>
									<input
										bind:value={confirmPassword}
										id="confirmPassword"
										type={showConfirmPassword ? 'text' : 'password'}
										required
										placeholder="Répétez le mot de passe"
										class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
										disabled={isLoading}
									/>
									<button type="button" on:click={() => togglePassword('confirm')} class="absolute inset-y-0 right-0 pr-3 flex items-center">
										<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											{#if showConfirmPassword}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
											{:else}
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
											{/if}
										</svg>
									</button>
								</div>
								<!-- Match indicator -->
								{#if confirmPassword.length > 0}
									<div class="flex items-center space-x-2 mt-2">
										{#if passwordsMatch}
											<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
											<span class="text-xs text-green-600">Les mots de passe correspondent</span>
										{:else}
											<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
											</svg>
											<span class="text-xs text-red-600">Les mots de passe ne correspondent pas</span>
										{/if}
									</div>
								{/if}
							</div>

							<!-- Password requirements -->
							<div class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
								<h4 class="text-sm font-semibold text-blue-800 mb-2">📋 Exigences du mot de passe :</h4>
								<ul class="text-xs text-blue-700 space-y-1">
									<li class="flex items-center space-x-2">
										<span class="w-1 h-1 bg-blue-400 rounded-full"></span>
										<span class={passwordValid ? 'line-through' : ''}>Au moins 8 caractères</span>
										{#if passwordValid}
											<svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
											</svg>
										{/if}
									</li>
									<li class="flex items-center space-x-2">
										<span class="w-1 h-1 bg-blue-400 rounded-full"></span>
										<span>Utilisez un mot de passe unique et complexe</span>
									</li>
									<li class="flex items-center space-x-2">
										<span class="w-1 h-1 bg-blue-400 rounded-full"></span>
										<span>Mélangez lettres, chiffres et caractères spéciaux</span>
									</li>
								</ul>
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
							<button type="submit" disabled={!canSubmit} class="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
								{#if isLoading}
									<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span>Modification en cours...</span>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
									<span>Modifier le mot de passe</span>
								{/if}
							</button>

							<!-- Security reminder -->
							<div class="text-center pt-4 border-t border-gray-100">
								<p class="text-gray-500 text-xs">
									🔒 Cette action modifiera définitivement votre mot de passe actuel
								</p>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>