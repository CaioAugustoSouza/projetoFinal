function mascararTelefone(input) {
    input.value = input.value
        .replace(/\D/g, '') // Remove tudo que não é dígito
        .replace(/^(\d{2})(\d)/, '($1) $2') // Coloca parênteses no DDD
        .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen após os cinco primeiros dígitos
        .substring(0, 15); // Limita a 15 caracteres
}