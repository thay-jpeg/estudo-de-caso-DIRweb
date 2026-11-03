-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Bairro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Bairro` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Bairro` (
  `idBairro` INT NOT NULL,
  `Bairro` VARCHAR(45) NULL,
  PRIMARY KEY (`idBairro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Tipo_logradouro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Tipo_logradouro` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Tipo_logradouro` (
  `idTipo_logradouro` INT NOT NULL,
  `Tipo_logradouro` VARCHAR(45) NULL,
  PRIMARY KEY (`idTipo_logradouro`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Logradouro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Logradouro` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Logradouro` (
  `idLogradouro` INT NOT NULL,
  `Logradouro` VARCHAR(45) NULL,
  `Tipo_logradouro_idTipo_logradouro` INT NOT NULL,
  PRIMARY KEY (`idLogradouro`, `Tipo_logradouro_idTipo_logradouro`),
  INDEX `fk_Logradouro_Tipo_logradouro1_idx` (`Tipo_logradouro_idTipo_logradouro` ASC) VISIBLE,
  CONSTRAINT `fk_Logradouro_Tipo_logradouro1`
    FOREIGN KEY (`Tipo_logradouro_idTipo_logradouro`)
    REFERENCES `mydb`.`Tipo_logradouro` (`idTipo_logradouro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`UF`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`UF` ;

CREATE TABLE IF NOT EXISTS `mydb`.`UF` (
  `idUF` INT NOT NULL,
  `UF` VARCHAR(45) NULL,
  `UFcol` VARCHAR(45) NULL,
  PRIMARY KEY (`idUF`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Cidade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Cidade` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Cidade` (
  `idCidade` INT NOT NULL,
  `Cidade` VARCHAR(45) NULL,
  `UF_idUF` INT NOT NULL,
  PRIMARY KEY (`idCidade`, `UF_idUF`),
  INDEX `fk_Cidade_UF1_idx` (`UF_idUF` ASC) VISIBLE,
  CONSTRAINT `fk_Cidade_UF1`
    FOREIGN KEY (`UF_idUF`)
    REFERENCES `mydb`.`UF` (`idUF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Endereco`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Endereco` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Endereco` (
  `idEndereco` INT NOT NULL,
  `CEP` VARCHAR(45) NULL,
  `Numero` VARCHAR(45) NULL,
  `Complemento` VARCHAR(45) NULL,
  `Bairro_idBairro` INT NOT NULL,
  `Logradouro_idLogradouro` INT NOT NULL,
  `Logradouro_Tipo_logradouro_idTipo_logradouro` INT NOT NULL,
  `Cidade_idCidade` INT NOT NULL,
  `Cidade_UF_idUF` INT NOT NULL,
  PRIMARY KEY (`idEndereco`, `Bairro_idBairro`, `Logradouro_idLogradouro`, `Logradouro_Tipo_logradouro_idTipo_logradouro`, `Cidade_idCidade`, `Cidade_UF_idUF`),
  INDEX `fk_Endereco_Bairro_idx` (`Bairro_idBairro` ASC) VISIBLE,
  INDEX `fk_Endereco_Logradouro1_idx` (`Logradouro_idLogradouro` ASC, `Logradouro_Tipo_logradouro_idTipo_logradouro` ASC) VISIBLE,
  INDEX `fk_Endereco_Cidade1_idx` (`Cidade_idCidade` ASC, `Cidade_UF_idUF` ASC) VISIBLE,
  CONSTRAINT `fk_Endereco_Bairro`
    FOREIGN KEY (`Bairro_idBairro`)
    REFERENCES `mydb`.`Bairro` (`idBairro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Endereco_Logradouro1`
    FOREIGN KEY (`Logradouro_idLogradouro` , `Logradouro_Tipo_logradouro_idTipo_logradouro`)
    REFERENCES `mydb`.`Logradouro` (`idLogradouro` , `Tipo_logradouro_idTipo_logradouro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Endereco_Cidade1`
    FOREIGN KEY (`Cidade_idCidade` , `Cidade_UF_idUF`)
    REFERENCES `mydb`.`Cidade` (`idCidade` , `UF_idUF`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Pessoa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Pessoa` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Pessoa` (
  `idPessoa` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NULL,
  `Endereco_idEndereco` INT NOT NULL,
  PRIMARY KEY (`idPessoa`),
  INDEX `fk_Pessoa_Endereco1_idx` (`Endereco_idEndereco` ASC) VISIBLE,
  CONSTRAINT `fk_Pessoa_Endereco1`
    FOREIGN KEY (`Endereco_idEndereco`)
    REFERENCES `mydb`.`Endereco` (`idEndereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Contribuinte`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Contribuinte` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Contribuinte` (
  `Pessoa_idPessoa` INT NOT NULL,
  `Sobrenome` VARCHAR(45) NULL,
  `Nome_Social` VARCHAR(45) NULL,
  `CPF` VARCHAR(45) NULL,
  `RG` VARCHAR(45) NULL,
  `Sexo` VARCHAR(45) NULL,
  PRIMARY KEY (`Pessoa_idPessoa`),
  INDEX `fk_Pessoa_Fisica_Pessoa1_idx` (`Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Pessoa_Fisica_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`DDI`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`DDI` ;

CREATE TABLE IF NOT EXISTS `mydb`.`DDI` (
  `idDDI` INT NOT NULL,
  `DDI` VARCHAR(45) NULL,
  PRIMARY KEY (`idDDI`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`DDD`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`DDD` ;

CREATE TABLE IF NOT EXISTS `mydb`.`DDD` (
  `idDDD` INT NOT NULL,
  `DDD` VARCHAR(45) NULL,
  `DDI_idDDI` INT NOT NULL,
  PRIMARY KEY (`idDDD`, `DDI_idDDI`),
  INDEX `fk_DDD_DDDI1_idx` (`DDI_idDDI` ASC) VISIBLE,
  CONSTRAINT `fk_DDD_DDDI1`
    FOREIGN KEY (`DDI_idDDI`)
    REFERENCES `mydb`.`DDI` (`idDDI`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Telefone`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Telefone` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Telefone` (
  `idTelefone` INT NOT NULL,
  `fone` VARCHAR(45) NULL,
  `DDD_idDDD` INT NOT NULL,
  `DDD_DDI_idDDI` INT NOT NULL,
  `Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idTelefone`, `DDD_idDDD`, `DDD_DDI_idDDI`, `Pessoa_idPessoa`),
  INDEX `fk_Telefone_DDD1_idx` (`DDD_idDDD` ASC, `DDD_DDI_idDDI` ASC) VISIBLE,
  INDEX `fk_Telefone_Pessoa1_idx` (`Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Telefone_DDD1`
    FOREIGN KEY (`DDD_idDDD` , `DDD_DDI_idDDI`)
    REFERENCES `mydb`.`DDD` (`idDDD` , `DDI_idDDI`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Telefone_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Email`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Email` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Email` (
  `idEmail` INT NOT NULL,
  `Email` VARCHAR(45) NULL,
  `Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idEmail`, `Pessoa_idPessoa`),
  INDEX `fk_Email_Pessoa1_idx` (`Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Email_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Tipo_dependente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Tipo_dependente` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Tipo_dependente` (
  `idTipo_dependente` INT NOT NULL,
  `Tipo_dependente` VARCHAR(45) NULL,
  PRIMARY KEY (`idTipo_dependente`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Dependente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Dependente` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Dependente` (
  `idDependente` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NULL,
  `CPF` VARCHAR(45) NULL,
  `Contribuinte_Pessoa_idPessoa` INT NOT NULL,
  `Tipo_dependente_idTipo_dependente` INT NOT NULL,
  PRIMARY KEY (`idDependente`),
  INDEX `fk_Dependente_Tipo_dependente1_idx` (`Tipo_dependente_idTipo_dependente` ASC) VISIBLE,
  INDEX `fk_Dependente_Pessoa_Fisica1_idx` (`Contribuinte_Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Dependente_Tipo_dependente1`
    FOREIGN KEY (`Tipo_dependente_idTipo_dependente`)
    REFERENCES `mydb`.`Tipo_dependente` (`idTipo_dependente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Dependente_Pessoa_Fisica1`
    FOREIGN KEY (`Contribuinte_Pessoa_idPessoa`)
    REFERENCES `mydb`.`Contribuinte` (`Pessoa_idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Declaracao_Renda`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Declaracao_Renda` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Declaracao_Renda` (
  `idDeclaracao_Renda` INT NOT NULL,
  `Contribuinte_Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idDeclaracao_Renda`),
  INDEX `fk_Declaracao_Renda_Pessoa_Fisica1_idx` (`Contribuinte_Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Declaracao_Renda_Pessoa_Fisica1`
    FOREIGN KEY (`Contribuinte_Pessoa_idPessoa`)
    REFERENCES `mydb`.`Contribuinte` (`Pessoa_idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Pessoa_Juridica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Pessoa_Juridica` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Pessoa_Juridica` (
  `CNPJ` VARCHAR(45) NOT NULL,
  `Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`Pessoa_idPessoa`),
  CONSTRAINT `fk_Pessoa_Juridica_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Rendimentos_trib_PJ`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Rendimentos_trib_PJ` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Rendimentos_trib_PJ` (
  `idRendimentos` INT NOT NULL,
  `Valor_Total_Recebido` VARCHAR(45) NULL,
  `Valor_13_salario` VARCHAR(45) NULL,
  `IRRF_pago` VARCHAR(45) NULL,
  `INSS` VARCHAR(45) NULL,
  `Declaracao_Renda_idDeclaracao_Renda` INT NOT NULL,
  `Pessoa_Juridica_Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idRendimentos`, `Declaracao_Renda_idDeclaracao_Renda`, `Pessoa_Juridica_Pessoa_idPessoa`),
  INDEX `fk_Rendimentos_trib_PJ_Declaracao_Renda1_idx` (`Declaracao_Renda_idDeclaracao_Renda` ASC) VISIBLE,
  INDEX `fk_Rendimentos_trib_PJ_Pessoa_Juridica1_idx` (`Pessoa_Juridica_Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_Rendimentos_trib_PJ_Declaracao_Renda1`
    FOREIGN KEY (`Declaracao_Renda_idDeclaracao_Renda`)
    REFERENCES `mydb`.`Declaracao_Renda` (`idDeclaracao_Renda`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rendimentos_trib_PJ_Pessoa_Juridica1`
    FOREIGN KEY (`Pessoa_Juridica_Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa_Juridica` (`Pessoa_idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Bens_direitos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Bens_direitos` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Bens_direitos` (
  `idBens_direitos` INT NOT NULL AUTO_INCREMENT,
  `Nome_bem` VARCHAR(45) NULL,
  `Valor_ano_anterior` VARCHAR(45) NULL,
  `Valor_31_12_2026` VARCHAR(45) NULL,
  `Contribuinte_Pessoa_idPessoa` INT NOT NULL,
  `Declaracao_Renda_idDeclaracao_Renda` INT NOT NULL,
  `Endereco_idEndereco` INT NOT NULL,
  PRIMARY KEY (`idBens_direitos`),
  INDEX `fk_Bens_direitos_Pessoa_Fisica1_idx` (`Contribuinte_Pessoa_idPessoa` ASC) VISIBLE,
  INDEX `fk_Bens_direitos_Declaracao_Renda1_idx` (`Declaracao_Renda_idDeclaracao_Renda` ASC) VISIBLE,
  INDEX `fk_Bens_direitos_Endereco1_idx` (`Endereco_idEndereco` ASC) VISIBLE,
  CONSTRAINT `fk_Bens_direitos_Pessoa_Fisica1`
    FOREIGN KEY (`Contribuinte_Pessoa_idPessoa`)
    REFERENCES `mydb`.`Contribuinte` (`Pessoa_idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Bens_direitos_Declaracao_Renda1`
    FOREIGN KEY (`Declaracao_Renda_idDeclaracao_Renda`)
    REFERENCES `mydb`.`Declaracao_Renda` (`idDeclaracao_Renda`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Bens_direitos_Endereco1`
    FOREIGN KEY (`Endereco_idEndereco`)
    REFERENCES `mydb`.`Endereco` (`idEndereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Tipo_Bem`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Tipo_Bem` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Tipo_Bem` (
  `idTipo_Bem` INT NOT NULL AUTO_INCREMENT,
  `descricao_tipo` VARCHAR(45) NULL,
  `Bens_direitos_idBens_direitos` INT NOT NULL,
  PRIMARY KEY (`idTipo_Bem`),
  INDEX `fk_Tipo_Bem_Bens_direitos1_idx` (`Bens_direitos_idBens_direitos` ASC) VISIBLE,
  CONSTRAINT `fk_Tipo_Bem_Bens_direitos1`
    FOREIGN KEY (`Bens_direitos_idBens_direitos`)
    REFERENCES `mydb`.`Bens_direitos` (`idBens_direitos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`UsuarioAcesso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`UsuarioAcesso` ;

CREATE TABLE IF NOT EXISTS `mydb`.`UsuarioAcesso` (
  `idUsuarioAcesso` INT NOT NULL AUTO_INCREMENT,
  `loginCpf` VARCHAR(45) NULL,
  `senhaHash` VARCHAR(45) NULL,
  `perfilAcesso` VARCHAR(45) NULL,
  `Contribuinte_Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idUsuarioAcesso`),
  INDEX `fk_UsuarioAcesso_Contribuinte1_idx` (`Contribuinte_Pessoa_idPessoa` ASC) VISIBLE,
  CONSTRAINT `fk_UsuarioAcesso_Contribuinte1`
    FOREIGN KEY (`Contribuinte_Pessoa_idPessoa`)
    REFERENCES `mydb`.`Contribuinte` (`Pessoa_idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
