-- VAP' & MOI PRO V105 — sécurisation et lecture publique des cartes QR
-- Ne supprime aucune table ni aucune donnée.
ALTER TABLE public.public_loyalty_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shop manages own loyalty cards"
ON public.public_loyalty_cards;

CREATE POLICY "shop manages own loyalty cards"
ON public.public_loyalty_cards
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.public_loyalty_cards
TO authenticated;

CREATE OR REPLACE FUNCTION public.get_public_loyalty_card(p_token uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'progress_to_next_reward', c.progress_to_next_reward,
    'amount_needed', c.amount_needed,
    'next_reward_amount', c.next_reward_amount,
    'available_reward_amount', c.available_reward_amount,
    'updated_at', c.updated_at
  )
  FROM public.public_loyalty_cards AS c
  WHERE c.public_token = p_token
    AND c.active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_loyalty_card(uuid)
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_public_loyalty_card(uuid)
TO anon, authenticated;
