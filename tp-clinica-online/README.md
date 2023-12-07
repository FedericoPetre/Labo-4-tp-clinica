# tp-clinica-online

Trabajo Práctico FINAL - Clínica Online - Laboratorio 4 
Bienvenidos!

En este repositorio se encuentra el trabajo práctico realizado durante la cursada de Laboratorio 4, UTN Avellaneda, 2 cuatrimestre 2023.
El proyecto consiste en el desarrollo de un sistema para la clínica online.

La clínica OnLine, especialista en salud, cuenta actualmente con consultorios, laboratorios y una sala de espera general. Está abierta al público de lunes a viernes en el horario de 8:00 a 19:00, y los sábados en el horario de 8:00 a 14:00.

Se implementó funcionalidades de registro e inicio sesión para pacientes, especialistas y administradores. Gestión de usuarios, creación de documentos pdf y excel (descargables), lazy loading, captcha, manejo de imágenes, pipes y directivas.


Adjunto las imágenes del proyecto:

Bienvenida del proyecto, muestra la información general de la clínica
![Captura de Pantalla Bienvenida](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/bienvenida.png)

¿Quién soy? Muestras los datos del alumno.
![Captura de Quien Soy](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/quien-soy.png)

Formulario de Ingreso. Permite a los distintos usuarios acceder al sistema. Previamente se realizó una verificación vía correo electrónico para validar la cuenta. A los botones de acceso rápido se les agregó una directiva personalizada que permite agrandarse cuando el cursor está sobre ellos.
![Captura de Login](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/ingreso.png)

Botones de registro. Permite elegir que tipo de usuario va a registrarse.
![Captura de registro](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/opciones-registro.png)

Formulario registro especialista. Para procesar el registro de un nuevo especialista. La zona de la foto tiene una directiva que cuando se presiona gira sobre su eje. Además el formulario tiene una directiva que cuando se oprime la tecla espacio en un input de tipo texto, este cambia a color azul y el texto a blanco
![Captura especialista](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/registro-especialista.png)

Formulario registro paciente. Para procesar el registro de un nuevo paciente. Cuenta con las mismas directivas que registro especialista.
![Captura paciente](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/registro-paciente.png)

Solicitar Turno. Los pacientes pueden solicitar un turno, filtrando por el especialista y la especialidad.
![Captura solicitud turnos](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/solicitar-turno.png)

Mis turnos Paciente. Los pacientes pueden todos sus turnos solicitados, finalizados y cancelados.
![Captura turnos paciente](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/mis-turnos-paciente.png)

Mi perfil Paciente. El paciente puede ver sus datos personales, su historia clínica (en caso de poseerla) y puede descargar un archivo pdf con los turnos que tuvo, según especialista que lo atendió.
![Captura mi perfil paciente](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/mi-perfil-paciente.png)

Mis turnos Especialista. El especialista puede aceptar, rechazar, finalizar turnos solicitados por los pacientes. Colocar reseña y comentario en caso de cancelar el turno.
![Captura mis turnos especialista](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/mis-turnos-especialista.png)

Mi perfil Especialista. Permite ver sus datos personales y modificar horarios en cada especialidad a la que se dedique.
![Captura mi perfil especialista](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/mi-perfil-especialista.png)

Sección Pacientes. Permite ver los pacientes que el especialista atendió. Cuando se selecciona un paciente, se puede ver los turnos finalizados con ese paciente.
![Captura seccion pacientes](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/seccion-pacientes.png)

Turnos administador. Permite al admin cancelar turnos solicitados, que todavía no fueron aceptados por los especialistas.
![Captura turnos admin](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/seccion-turnos-admin.png)

Sección Usuarios admin. Permite a los administradores descargar un listado de los turnos por paciente, los datos de todos los usuarios y habilitar o deshabilitar a los especialistas.
![Captura seccion usuarios admin](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/seccion-usuarios-admin.png)

Formulario de registro admin. Solo administradores pueden dar de alta a otro administrador.
![Captura alta administradores](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/registro-admin.png)

Seccion gráficos y estadísticas. El admin puede acceder a los gráficos y estadísticas sobre el análisis de los turnos de la clínica. Además de ver los logs al sistema. Puede descargar en pdf o excel cada uno de los informes.
![Captura gráficos admin](https://github.com/FedericoPetre/Labo-4-tp-clinica/raw/main/tp-clinica-online/src/assets/img/capturas/seccion-graficos-admin.png)




