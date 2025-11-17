package br.com.recicla.conect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.ModelAndView;

import br.com.recicla.conect.model.Catador;
import br.com.recicla.conect.repository.CatadorRespository;



@Controller
public class CadastroController {

    @Autowired
    private CatadorRespository catadorRespository;

    @GetMapping("/cadastro-catador")
    public ModelAndView cadastroCatador(){
        return new ModelAndView("cadastro-catador");
    }

    @PostMapping("/api/cadastro-catador")
    public ResponseEntity<?> postMethodName(@RequestBody Catador catador) {
    
        catadorRespository.save(catador);
        
        return ResponseEntity.ok().build();
    }
    
    
}
