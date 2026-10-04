-- 1. Adicionar constraints de validação na tabela notas_fiscais
ALTER TABLE public.notas_fiscais
ADD CONSTRAINT check_valor_positivo CHECK (valor_total > 0),
ADD CONSTRAINT check_serie_valida CHECK (serie BETWEEN 1 AND 999),
ADD CONSTRAINT check_numero_positivo CHECK (numero > 0);

-- 2. Adicionar constraint para produtos_servicos
ALTER TABLE public.produtos_servicos
ADD CONSTRAINT check_valor_unitario_positivo CHECK (valor_unitario >= 0);

-- 3. Criar função de validação para JSONB de dados_fiscais
CREATE OR REPLACE FUNCTION public.validate_dados_fiscais()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  item jsonb;
  total_calculado numeric := 0;
BEGIN
  -- Verificar se dados_fiscais tem estrutura mínima
  IF NEW.dados_fiscais IS NULL THEN
    RAISE EXCEPTION 'dados_fiscais não pode ser nulo';
  END IF;
  
  -- Se houver itens, validar e recalcular total
  IF NEW.dados_fiscais ? 'itens' AND jsonb_array_length(NEW.dados_fiscais->'itens') > 0 THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.dados_fiscais->'itens')
    LOOP
      -- Validar quantidade positiva
      IF (item->>'quantidade')::numeric <= 0 THEN
        RAISE EXCEPTION 'Quantidade deve ser maior que zero';
      END IF;
      
      -- Validar valor unitário positivo
      IF (item->>'valor_unitario')::numeric < 0 THEN
        RAISE EXCEPTION 'Valor unitário não pode ser negativo';
      END IF;
      
      -- Calcular total do item
      total_calculado := total_calculado + 
        ((item->>'quantidade')::numeric * (item->>'valor_unitario')::numeric);
    END LOOP;
    
    -- Validar se valor_total corresponde aproximadamente (tolerância de 0.01)
    IF ABS(NEW.valor_total - total_calculado) > 0.01 THEN
      -- Corrigir automaticamente o valor total
      NEW.valor_total := total_calculado;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Criar trigger para validar dados antes de insert/update
DROP TRIGGER IF EXISTS trigger_validate_dados_fiscais ON public.notas_fiscais;
CREATE TRIGGER trigger_validate_dados_fiscais
BEFORE INSERT OR UPDATE ON public.notas_fiscais
FOR EACH ROW
EXECUTE FUNCTION public.validate_dados_fiscais();