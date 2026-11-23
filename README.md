# Portafolio de Shammel Hernández

Diseño inspirado en la página de referencia (cabecera oscura, portada roja, redes a la izquierda). Sitio con HTML5, CSS3 y JavaScript; formulario de contacto en PHP + MySQL.

## Antes de subir: cambia estos datos
- `index.html`: tu correo y tu usuario de GitHub (busca `tu-correo@ejemplo.com` y `tu-usuario`).
- `img/foto-perfil.svg` y `img/galeria-1..6.svg`: reemplázalos por tus fotos y capturas (si usas .jpg o .png, cambia también el `src` y el `data-full` en `index.html`).
- **Testimonios**: escribe los 3 testimonios reales de compañeros y docentes, con su permiso.

## Probar en XAMPP
1. Copia la carpeta a `C:\xampp\htdocs\portafolio`.
2. Abre XAMPP e inicia Apache y MySQL.
3. En `http://localhost/phpmyadmin` importa `sql/portafolio.sql`.
4. Copia `php/config.example.php` como `php/config.php` (en XAMPP sirve tal cual).
5. Abre `http://localhost/portafolio/` y envía un mensaje: debe aparecer en la tabla `mensajes`.
Sin `config.php`, el formulario igual funciona y guarda en `php/storage/mensajes.log`.

## Subir a InfinityFree
1. Panel > MySQL Databases: crea la base; anota host, nombre, usuario y clave.
2. phpMyAdmin de InfinityFree: importa `sql/portafolio.sql` (sin las dos primeras instrucciones).
3. Crea `php/config.php` con esos datos.
4. Con el File Manager o FTP, sube todo el contenido a `htdocs/` (`index.html` debe quedar dentro de `htdocs`).
5. Apunta tu dominio o usa el subdominio gratuito a la cuenta y prueba el formulario en el sitio real.

## Subir a GitHub
```
git init
git add .
git commit -m "Portafolio inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/portafolio.git
git push -u origin main
```
`php/config.php` está en `.gitignore`: tus claves no se publican.
Nota: GitHub Pages no ejecuta PHP; el formulario solo funciona en XAMPP o InfinityFree.


## Interacciones añadidas
- Menú móvil accesible, navegación que marca la sección actual y cierre con Escape/clic fuera.
- Barra de progreso de lectura y botón flotante para volver arriba.
- Animaciones de entrada al desplazarse (respetan la preferencia de movimiento reducido).
- Buscador de proyectos combinado con filtros por categoría.
- Ventana de detalles para cada proyecto con tecnologías y enlaces a demo/repositorio.
- Galería ampliable y formulario con validación y estados de envío.

## Conectar tus proyectos reales
Abre `js/projects.js`. En cada proyecto completa `demo` con la URL publicada y `repo` con la URL de GitHub. Ejemplo:
```js
demo: "https://tuusuario.github.io/fixhome/",
repo: "https://github.com/tuusuario/fixhome"
```
No coloques contraseñas ni claves privadas en ese archivo. Los enlaces se muestran automáticamente cuando contienen una URL válida `https://` o `http://`. Las URLs no se han inventado: deben reemplazarse por las direcciones reales de tus proyectos.
