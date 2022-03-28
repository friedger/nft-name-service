(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-public (pay (nft <nft-trait>) (id uint) (name (string-utf8 256)))
  (stx-transfer? u2000000 tx-sender 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9))
