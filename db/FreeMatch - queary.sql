-- CREACION DE DATABASE
CREATE DATABASE freematch;
USE freematch;

-- TABLA DE USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_cuenta ENUM('freelancer', 'cliente') NOT NULL,
    pais VARCHAR(100),
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);

-- TABLA DE PERFILES
CREATE TABLE perfiles (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    imagen_perfil VARCHAR(255),
    anos_experiencia INT,
    lenguajes TEXT,
    enlace_portafolio VARCHAR(255),
    biografia TEXT,
    verificado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA DE PROYECTOS
CREATE TABLE proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_freelancer INT NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio DECIMAL(10, 2) NOT NULL,
    estado ENUM('abierto', 'en_progreso', 'completado', 'cancelado') DEFAULT 'abierto',
    caracteristicas TEXT,
    lenguajes JSON,
    FOREIGN KEY (id_usuario_freelancer) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


-- TABLA DE MULTIMEDIA PARA PROYECTOS
CREATE TABLE multimedia (
    id_multimedia INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    imagenes JSON,
    video VARCHAR(255),
    url VARCHAR(255),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE
);

-- TABLA DE COMENTARIOS
CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_usuario_comentarista INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_comentarista) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA DE SUSCRIPCIONES
CREATE TABLE suscripciones (
    id_suscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    estado ENUM('activa', 'expirada') DEFAULT 'activa',
    stripe_subscription_id VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA DE PAGOS
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_usuario_cliente INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_pago ENUM('pendiente', 'completado', 'fallido') DEFAULT 'pendiente',
    stripe_payment_id VARCHAR(255),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- TABLA DE CALIFICACIONES
CREATE TABLE calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_proyecto INT NOT NULL,
    id_usuario_freelancer INT NOT NULL,
    id_usuario_cliente INT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5),
    resena TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_freelancer) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
