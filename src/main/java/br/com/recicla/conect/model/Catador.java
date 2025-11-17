package br.com.recicla.conect.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Entity
@Table(name = "catadores")
public class Catador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter @Setter
    @Column(length = 50)
    private String nome;
    
    @Getter @Setter
    @Column(length = 11)
    private String cpf;

    @Getter @Setter
    @Column(length = 100)
    private String email;
    
    @Getter @Setter
    @Column(length = 15)
    private String telefone;
    
    @Getter @Setter
    @Column(length = 10)
    private String cep;
    
    @Getter @Setter
    @Column(length = 50)
    private String cidade;
    
    @Getter @Setter
    @Column(length = 50)
    private String bairro;
    
    @Getter @Setter
    @Column(length = 20)
    private String tipo;
    
}
