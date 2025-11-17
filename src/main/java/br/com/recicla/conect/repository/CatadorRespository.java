package br.com.recicla.conect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.recicla.conect.model.Catador;

public interface CatadorRespository extends JpaRepository<Catador, Long> {
    
}
