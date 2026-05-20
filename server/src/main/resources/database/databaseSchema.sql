USE [master]
GO

-- Eliminar BD si ya existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'AntojosUPBdb')
BEGIN
    ALTER DATABASE [AntojosUPBdb] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [AntojosUPBdb];
END
GO

-- Crear BD sin rutas hardcodeadas (SQL Server elige la ruta por defecto)
CREATE DATABASE [AntojosUPBdb]
GO

ALTER DATABASE [AntojosUPBdb] SET COMPATIBILITY_LEVEL = 150  -- SQL Server 2019
GO

USE [AntojosUPBdb]
GO

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE [dbo].[ROLUSUARIO](
    [IdRol]     [int] IDENTITY(1,1) NOT NULL,
    [NombreRol] [varchar](20) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdRol] ASC),
    UNIQUE ([NombreRol])
)
GO

CREATE TABLE [dbo].[USUARIOS](
    [IdUser]    [int] IDENTITY(1,1) NOT NULL,
    [Email]     [varchar](150) NOT NULL,
    [Contrasena][nvarchar](150) NOT NULL,
    [FechaRegis][datetime] NOT NULL CONSTRAINT [DF_USUARIOS_FechaRegis] DEFAULT (GETDATE()),
    [IdRol]     [int] NOT NULL,
    [telefono]  [varchar](20) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdUser] ASC),
    UNIQUE ([Email]),
    UNIQUE ([telefono]),
    CONSTRAINT [FK_RolUsuario_Usuarios] FOREIGN KEY ([IdRol]) REFERENCES [dbo].[ROLUSUARIO]([IdRol]),
    CONSTRAINT [CHK_Email_Formato]    CHECK ([Email] LIKE '%_@%_._%' AND NOT [Email] LIKE '%[^a-z0-9._-]%@%' AND NOT [Email] LIKE '%@%[^a-z0-9.-]%'),
    CONSTRAINT [CHK_Telefono_Formato] CHECK (LEN([telefono]) = 10 AND [telefono] LIKE '3[0-5]%' AND NOT [telefono] LIKE '%[^0-9]%'),
    CONSTRAINT [CK_ContrasenaVen]     CHECK (LEN([Contrasena]) >= 8)
)
GO

CREATE TABLE [dbo].[CLIENTES](
    [IdCliente]    [int] IDENTITY(1,1) NOT NULL,
    [NombreClient] [nvarchar](150) NOT NULL,
    [IdUser]       [int] NOT NULL,
    PRIMARY KEY CLUSTERED ([IdCliente] ASC),
    CONSTRAINT [FK_Clientes_Usuarios] FOREIGN KEY ([IdUser]) REFERENCES [dbo].[USUARIOS]([IdUser]),
    CONSTRAINT [CHK_Nombre_Formato]   CHECK (NOT [NombreClient] LIKE '%[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]%' AND LEN([NombreClient]) >= 2)
)
GO

CREATE TABLE [dbo].[CATEGORIAVENDEDOR](
    [IdCategoriaV]   [int] IDENTITY(1,1) NOT NULL,
    [NombreCategoria][nvarchar](50) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdCategoriaV] ASC)
)
GO

CREATE TABLE [dbo].[VENDEDORES](
    [IdVendedor]      [int] IDENTITY(1,1) NOT NULL,
    [NombreNegocio]   [nvarchar](150) NOT NULL,
    [DescripcionNeg]  [nvarchar](max) NULL,
    [WhatsAppLink]    [varchar](120) NOT NULL,
    [IdUser]          [int] NOT NULL,
    [NombrePropietario][nvarchar](150) NOT NULL,
    [Activo]          [bit] NOT NULL CONSTRAINT [DF_VENDEDORES_Activo] DEFAULT (0),
    [InstagramLink]   [varchar](120) NULL,
    PRIMARY KEY CLUSTERED ([IdVendedor] ASC),
    UNIQUE ([NombreNegocio]),
    CONSTRAINT [FK_Vendedores_Usuarios] FOREIGN KEY ([IdUser]) REFERENCES [dbo].[USUARIOS]([IdUser])
)
GO

CREATE TABLE [dbo].[VENDEDOR_CATEGORIA](
    [IdVendedor]   [int] NOT NULL,
    [IdCategoriaV] [int] NOT NULL,
    PRIMARY KEY CLUSTERED ([IdVendedor] ASC, [IdCategoriaV] ASC),
    CONSTRAINT [FK_VC_Vendedores] FOREIGN KEY ([IdVendedor])   REFERENCES [dbo].[VENDEDORES]([IdVendedor]),
    CONSTRAINT [FK_VC_Categoria]  FOREIGN KEY ([IdCategoriaV]) REFERENCES [dbo].[CATEGORIAVENDEDOR]([IdCategoriaV])
)
GO

CREATE TABLE [dbo].[CATALOGO](
    [IdCatalogo]    [int] IDENTITY(1,1) NOT NULL,
    [NombreCatalogo][varchar](100) NOT NULL,
    [FechaCreacion] [datetime] NULL CONSTRAINT [DF_CATALOGO_FechaCreacion] DEFAULT (GETDATE()),
    [IdVendedor]    [int] NOT NULL,
    PRIMARY KEY CLUSTERED ([IdCatalogo] ASC),
    UNIQUE ([IdVendedor]),
    CONSTRAINT [FK_Catalogos_Vendedores] FOREIGN KEY ([IdVendedor]) REFERENCES [dbo].[VENDEDORES]([IdVendedor])
)
GO

CREATE TABLE [dbo].[PRODUCTOS](
    [IdProducto]    [int] IDENTITY(1,1) NOT NULL,
    [NombreProd]    [varchar](150) NOT NULL,
    [DescripcionProd][nvarchar](max) NULL,
    [Precio]        [int] NOT NULL,
    [IdCatalogo]    [int] NOT NULL,
    PRIMARY KEY CLUSTERED ([IdProducto] ASC),
    CONSTRAINT [FK_Productos_Catalogos] FOREIGN KEY ([IdCatalogo]) REFERENCES [dbo].[CATALOGO]([IdCatalogo]),
    CONSTRAINT [CK_PrecioPositivo]      CHECK ([Precio] >= 0)
)
GO

CREATE TABLE [dbo].[DIASSEMANA](
    [IdDia]    [int] IDENTITY(1,1) NOT NULL,
    [NombreDia][varchar](20) NOT NULL,
    PRIMARY KEY CLUSTERED ([IdDia] ASC),
    UNIQUE ([NombreDia])
)
GO

CREATE TABLE [dbo].[HORARIOSV](
    [IdHorario] [int] IDENTITY(1,1) NOT NULL,
    [HoraInicio][time](7) NOT NULL,
    [HoraFin]   [time](7) NOT NULL,
    [IdDia]     [int] NOT NULL,
    [IdVendedor][int] NOT NULL,
    PRIMARY KEY CLUSTERED ([IdHorario] ASC),
    CONSTRAINT [FK_HORARIOS_DIA]       FOREIGN KEY ([IdDia])      REFERENCES [dbo].[DIASSEMANA]([IdDia]),
    CONSTRAINT [FK_HORARIOS_VENDEDORES] FOREIGN KEY ([IdVendedor]) REFERENCES [dbo].[VENDEDORES]([IdVendedor])
)
GO

-- ============================================================
-- DATOS SEMILLA
-- ============================================================

INSERT INTO [dbo].[ROLUSUARIO] ([NombreRol]) VALUES ('Vendedor'), ('Cliente')
GO

INSERT INTO [dbo].[CATEGORIAVENDEDOR] ([NombreCategoria]) VALUES
    ('Bebidas'), ('Comida Casera'), ('Comida Rápida'),
    ('Galletas y Brownies'), ('Helados'), ('Otros'),
    ('Pasabocas y Fritos'), ('Postres / Dulces'),
    ('Productos Artesanales'), ('Snacks'), ('Tortas y Pasteles')
GO

INSERT INTO [dbo].[DIASSEMANA] ([NombreDia]) VALUES
    ('Lunes'), ('Martes'), ('Miércoles'), ('Jueves'),
    ('Viernes'), ('Sábado'), ('Domingo')
GO