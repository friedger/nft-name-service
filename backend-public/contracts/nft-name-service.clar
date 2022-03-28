(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(define-trait commission-trait
  ((pay (principal uint (string-utf8 256)) (response bool uint))))

(define-map names {nft: principal, id: uint} (string-utf8 256))
(define-map lookup {nft: principal, name: (string-utf8 256)} uint)


(define-public (register (nft <nft-trait>) (id uint) (name (string-utf8 256))
                           (commission <commission-trait>))
  (let ((owner (unwrap! (unwrap! (contract-call? nft get-owner id) err-not-found) err-not-found)))
    (asserts! (is-eq tx-sender owner) err-not-authorized)
    ;; check duplicate name
    (asserts! (is-none (map-get? lookup {nft: (contract-of nft), name: name})) err-name-exists)
    ;; remove old name
    (match (map-get? names {nft: (contract-of nft), id: id})
      old-name (map-delete lookup {nft: (contract-of nft), name: old-name})
      true)
    (try! (contract-call? commission pay (contract-of nft) id name))
    ;; register name
    (map-set names {nft: (contract-of nft), id: id} name)
    (map-set lookup {nft: (contract-of nft), name: name} id)
    (ok true)))

(define-public (delete (nft <nft-trait>) (id uint) (name (string-utf8 256)))
  (let ((owner (unwrap! (unwrap! (contract-call? nft get-owner id) err-not-found) err-not-found)))    (asserts! (is-eq tx-sender owner) err-not-authorized)
    (asserts! (is-eq tx-sender owner) err-not-authorized)
    (map-delete names {nft: (contract-of nft), id: id})
    (map-delete lookup {nft: (contract-of nft), name: name})
    (ok true)))

;; The naming service does not take any fees.
;; Clients can use this contract as commission or use their own contract.
(define-read-only (pay (nft <nft-trait>) (id uint) (name (string-utf8 256)))
  (ok true))

(define-read-only (resolve-by-name (nft <nft-trait>) (name (string-utf8 256)))
  (map-get? lookup {nft: (contract-of nft), name: name}))

(define-read-only (resolve-by-id (nft <nft-trait>) (id uint))
  (map-get? names {nft: (contract-of nft), id: id}))

(define-constant err-not-authorized (err u403))
(define-constant err-not-found (err u404))
(define-constant err-name-exists (err u404))
