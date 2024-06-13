import express from 'express';
import path from 'path'
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

const app = express();

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})

app.use(express.static(path.join(process.cwd(), 'publico')));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    secret: 'sercetKey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

// Regex para validação de email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Regex para validação de telefone
const telefoneRegex = /^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/;

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next();
    }
    else {
        resposta.redirect('/login.html');
    }
}

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == '123' && senha == '100200') {
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
        resposta.redirect('/');
    }
    else {
        resposta.write(`<!DOCTYPE html>
                        <html lang="en">

                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Aula 3 formulario</title>
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
                                integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                        </head>

                        <body>
                        <div class="container">
                            <div class="alert alert-danger" role="alert">
                              Usuário e/ou senha iválido!
                            </div>
                            <a class="btn btn-primary" href="/login.html" role="button">Voltar</a>`)

        if (requisicao.cookies.dataUltimoAcesso) {
            resposta.write(`<hr><p>Ultimo acesso realizado em ${requisicao.cookies.dataUltimoAcesso}</p>`)
        }
        resposta.write(`
                        </div>
                        </body>
                        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
                            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
                            crossorigin="anonymous"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
                            integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
                            crossorigin="anonymous"></script>
                        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
                            integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
                            crossorigin="anonymous"></script>

                        </html>`)
        resposta.end();
    }
}

app.post('/login', autenticarUsuario);

app.get('/login', (requisicao, resposta) => {
    resposta.redirect('/login.html');
});

app.get('/logout', (requisicao, resposta) => {
    requisicao.session.destroy();
    //req.session.usuarioLogado = false;
    resposta.redirect('/login.html');
});

app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

let listaPessoas = [];

function cadastrarPessoa(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const email = requisicao.body.email;
    const telefone = requisicao.body.telefone;

    if (nome && emailRegex.test(email) && telefoneRegex.test(telefone)) {
        listaPessoas.push({
            nome: nome,
            email: email,
            telefone: telefone
        })
        resposta.redirect('/listarPessoas')
    }
    else {
        resposta.write(`<!DOCTYPE html>
                        <html lang="en">
                                
                        <head>
                            <meta charset="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                            <meta name="description" content="" />
                            <meta name="author" content="" />
                            <title>Adote um Pet</title>
                            <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
                            <!-- Font Awesome icons (free version)-->
                            <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
                            <!-- Google fonts-->
                            <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet" />
                            <link
                                href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                                rel="stylesheet" />
                            <!-- Core theme CSS (includes Bootstrap)-->
                            <link href="css/styles.css" rel="stylesheet" />
                            <link href="css/meuestilo.css" rel="stylesheet" />
                        </head>
                                
                        <body id="page-top">
                            <!-- Navigation-->
                            <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                                <div class="container px-4 px-lg-5">
                                    <a class="navbar-brand" href="index.html">Amigo de Pet</a>
                                    <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                        aria-label="Toggle navigation">
                                        Menu
                                        <i class="fas fa-bars"></i>
                                    </button>
                                    <div class="collapse navbar-collapse" id="navbarResponsive">
                                        <ul class="navbar-nav ms-auto">
                                            <li class="nav-item"><a class="nav-link" href="form01.html">Cadastrar uma Pessoa</a></li>
                                            <li class="nav-item"><a class="nav-link" href="form02.html">Cadastrar um Pet</a></li>
                                            <li class="nav-item"><a class="nav-link" href="/desejo">Adotar um Pet</a></li>
                                            <li class="nav-item"><a class="nav-link" href="/logout">Sair</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                            <!-- Signup-->
                            <section class="signup-section" id="signup">
                                <div class="container px-4 px-lg-5">
                                    <div class="row gx-4 gx-lg-5">
                                        <div class="col-md-10 col-lg-8 mx-auto text-center">
                                            <i class="far fa-paper-plane fa-2x mb-2 text-white"></i>
                                            <h2 class="text-white mb-5">Faça cadastro de pessoa para adotar um pet</h2>
                                            <form class="form-signup" id="contactForm" action="/cadastrarPessoa" method="POST">
                                                <div class="row input-group-newsletter">
                                                    <div class="row mt-5 mb-5">
                                                        <label class="meu-label" for="nome">Nome: </label>
                                                        <input class="form-control" id="nome" type="text" name="nome"
                                                            placeholder="nome completo..." value="${nome}" />`)
        if (!nome){ 
            resposta.write (`
                                                        <div class="alert alert-warning  mt-1" role="alert">
                                                            Preencha esse campo corretamente!
                                                        </div>`
        )}
        resposta.write(`                                                        
                                                    </div>
                                                    <dic class="row">
                                                        <div class="col-sm mt-5 mb-5">
                                                            <label class="meu-label" for="nome">Email: </label>
                                                            <input class="form-control" id="email" type="email" name="email"
                                                                placeholder="email@provedor.com..." value="${email}" />`)
        if (!email){
            resposta.write (`
                                                        <div class="alert alert-warning  mt-1" role="alert">
                                                            Preencha esse campo corretamente!
                                                        </div>`
        )}
        resposta.write(`     
                                                        </div>
                                                        <div class="col-sm mt-5 mb-5">
                                                            <label class="meu-label" for="telefone">Telefone: </label>
                                                            <input oninput="mascararTelefone(this)" class="form-control" id="telefone" type="text" placeholder="telefone..."
                                                                name="telefone" value="${telefone}" />`)
        if (telefone==null ||  telefoneRegex.test(telefone)==false){
            resposta.write (`
                                                        <div class="alert alert-warning  mt-1" role="alert">
                                                            Preencha esse campo corretamente!
                                                        </div>`
        )}
        resposta.write(`  
                                                        </div>
                                                    </dic>
                                                </div>
                                                <div class="mt-5 mb-5"><button class="btn btn-primary" id="submitButton"
                                                        type="submit">Cadastrar</button></div>
                                            </form>
                                            <div class="mt-5 mb-5"><a href="/listarPessoas"><button class="btn btn-light">Listar Cadastrados</button></a></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            </section>
                            <!-- Footer-->
                            <footer class="footer bg-black small text-center text-white-50">
                                <div class="container px-4 px-lg-5">Desenvolvido por &copy; Caio Souza 2024</div>
                            </footer>
                            <!-- Bootstrap core JS-->
                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
                            <!-- Core theme JS-->
                            <script src="js/scripts.js"></script>
                            <script src="js/meujs.js"></script>
                            <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
                            <!-- * *                               SB Forms JS                               * *-->
                            <!-- * * Activate your form at https://startbootstrap.com/solution/contact-forms * *-->
                            <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
                            <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
                        </body>
                                
                        </html>`)
    }
    resposta.end()
}


app.post('/cadastrarPessoa', usuarioEstaAutenticado, cadastrarPessoa)

app.use('/listarPessoas', usuarioEstaAutenticado, (requisicao, resposta) => {
    resposta.write(`<!DOCTYPE html>
                    <html lang="en">

                    <head>
                        <meta charset="utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                        <meta name="description" content="" />
                        <meta name="author" content="" />
                        <title>Adote um Pet</title>
                        <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
                        <!-- Font Awesome icons (free version)-->
                        <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
                        <!-- Google fonts-->
                        <link href="https://fonts.googleapis.com/css?family=Varela+Round" rel="stylesheet" />
                        <link
                            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
                            rel="stylesheet" />
                        <!-- Core theme CSS (includes Bootstrap)-->
                        <link href="css/styles.css" rel="stylesheet" />
                        <link href="css/meuestilo.css" rel="stylesheet" />
                    </head>

                    <body id="page-top">
                        <!-- Navigation-->
                        <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                            <div class="container px-4 px-lg-5">
                                <a class="navbar-brand" href="index.html">Amigo de Pet</a>
                                <button class="navbar-toggler navbar-toggler-right" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                    Menu
                                    <i class="fas fa-bars"></i>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarResponsive">
                                    <ul class="navbar-nav ms-auto">
                                        <li class="nav-item"><a class="nav-link" href="form01.html">Fazer Meu Cadastro</a></li>
                                        <li class="nav-item"><a class="nav-link" href="form02.html">Cadastrar um Pet</a></li>
                                        <li class="nav-item"><a class="nav-link" href="/desejo">Adotar um Pet</a></li>
                                        <li class="nav-item"><a class="nav-link" href="/logout">Sair</a></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <!-- Signup-->
                        <section class="signup-section" id="signup">
                            <div class="container px-4 px-lg-5">
                                <h1 style="color: white;">Lista de Pessoas Interessada em Adotar um Pet</h1>
                                <table class="table table-light table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Nome</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Telefone</th>
                                        </tr>
                                    </thead>
                                    <tbody>`)

    for (let i=0; i<listaPessoas.length; i++){
        resposta.write(`
                    <tr>
                        <td>${listaPessoas[i].nome}</td>
                        <td>${listaPessoas[i].email}</td>
                        <td>${listaPessoas[i].telefone}</td>
                    </tr>
        `)
    }
    resposta.write(`
         
                                    </tbody>
                                </table>
                                <a href="form01.html"><button class="btn btn-primary">voltar</button></a>
                            </div>
                        </section>
                        <!-- Footer-->
                        <footer class="footer bg-black small text-center text-white-50">
                            <div class="container px-4 px-lg-5">Desenvolvido por &copy; Caio Souza 2024</div>
                        </footer>
                        <!-- Bootstrap core JS-->
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
                        <!-- Core theme JS-->
                        <script src="js/scripts.js"></script>
                        <script src="js/meujs.js"></script>
                        <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
                        <!-- * *                               SB Forms JS                               * *-->
                        <!-- * * Activate your form at https://startbootstrap.com/solution/contact-forms * *-->
                        <!-- * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *-->
                        <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
                    </body>

                    </html>`);
    resposta.end();
});