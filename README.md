<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socio Estratégico | Marca Personal y Podcast</title>
    <style>
        :root {
            --color-primario: #000000;
            --color-secundario: #ffffff;
            --color-gris: #f4f4f4;
            --color-texto: #333333;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        body {
            color: var(--color-texto);
            line-height: 1.6;
        }

        header {
            background-color: var(--color-primario);
            color: var(--color-secundario);
            padding: 20px 5%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .logo-header {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-header img {
            height: 40px;
            width: auto;
            filter: invert(1); /* Pone el logo en blanco si es negro */
        }

        .logo-header h1 {
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        nav ul {
            list-style: none;
            display: flex;
            gap: 20px;
        }

        nav a {
            color: var(--color-secundario);
            text-decoration: none;
            font-weight: bold;
            font-size: 0.9rem;
            text-transform: uppercase;
            transition: color 0.3s;
        }

        nav a:hover {
            color: #ccc;
        }

        /* Hero Section */
        .hero {
            background-color: var(--color-secundario);
            padding: 80px 10%;
            text-align: center;
        }

        .hero img {
            width: 120px;
            margin-bottom: 30px;
        }

        .hero h2 {
            font-size: 3rem;
            margin-bottom: 20px;
            color: var(--color-primario);
        }

        .hero p {
            font-size: 1.2rem;
            max-width: 600px;
            margin: 0 auto 30px auto;
            color: #666;
        }

        .btn {
            display: inline-block;
            background-color: var(--color-primario);
            color: var(--color-secundario);
            padding: 15px 30px;
            text-decoration: none;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 2px solid var(--color-primario);
            transition: all 0.3s;
        }

        .btn:hover {
            background-color: transparent;
            color: var(--color-primario);
        }

        /* Sobre Mí / Filosofía */
        .section {
            padding: 80px 10%;
            text-align: center;
        }

        .section h3 {
            font-size: 2rem;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .filosofia {
            background-color: var(--color-gris);
        }

        .cards-container {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 40px;
        }

        .card {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            width: 300px;
            border-top: 4px solid var(--color-primario);
        }

        .card h4 {
            margin-bottom: 15px;
            font-size: 1.2rem;
        }

        /* Podcast Section */
        .podcast-container {
            max-width: 800px;
            margin: 40px auto 0 auto;
            background: white;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        footer {
            background-color: var(--color-primario);
            color: var(--color-secundario);
            text-align: center;
            padding: 40px 10%;
            margin-top: 0;
        }

        footer img {
            height: 50px;
            margin-bottom: 20px;
            filter: invert(1);
        }

        @media (max-width: 768px) {
            .hero h2 { font-size: 2rem; }
            nav ul { display: none; } /* Simplifica el menú en móvil por ahora */
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="logo-header">
            <img src="logo.jpg" alt="Logo Socio Estratégico">
            <h1>Socio Estratégico</h1>
        </div>
        <nav>
            <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#filosofia">Filosofía</a></li>
                <li><a href="#podcast">Podcast</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="inicio" class="hero">
        <img src="logo.jpg" alt="Hexágono con apretón de manos">
        <h2>Tu Socio Estratégico</h2>
        <p>Más que un podcast, un espacio donde construimos alianzas, transformamos ideas y desarrollamos estrategias para crecer juntos.</p>
        <a href="#podcast" class="btn">Escuchar el Podcast</a>
    </section>

    <!-- Filosofía / Valor -->
    <section id="filosofia" class="section filosofia">
        <h3>La Filosofía del Socio Estratégico</h3>
        <p>Todo lo que hago gira en torno a una idea central: el poder de la colaboración mutua. No busco seguidores, busco socios.</p>
        
        <div class="cards-container">
            <div class="card">
                <h4>Colaboración</h4>
                <p>El apretón de manos de nuestro logo simboliza igualdad y confianza. Trabajamos hombro a hombro para lograr objetivos comunes.</p>
            </div>
            <div class="card">
                <h4>Estrategia</h4>
                <p>El hexágono representa estructura y estabilidad. Cada idea se diseña con un propósito claro y un plan de acción.</p>
            </div>
            <div class="card">
                <h4>Crecimiento</h4>
                <p>Como tu socio, mi objetivo es aportar valor real que te ayude a escalar, ya sea en tus negocios o en tu desarrollo personal.</p>
            </div>
        </div>
    </section>

    <!-- Podcast Section -->
    <section id="podcast" class="section">
        <h3>Escucha el Podcast</h3>
        <p>Suscríbete y únete a la conversación en Spotify.</p>
        
        <div class="podcast-container">
            <!-- Embed de Spotify -->
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/show/7pnHY1N2j53Mvr2B2dMrZR?utm_source=generator&theme=0" width="100%" height="500" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <img src="logo.jpg" alt="Logo Socio Estratégico">
        <p>&copy; 2023 Socio Estratégico. Todos los derechos reservados.</p>
        <p>Construyendo alianzas, una estrategia a la vez.</p>
    </footer>

</body>
</html>
