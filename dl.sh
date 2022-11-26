for v in 3.0.3 3.1.8 3.2.4 3.3.4000 3.4.5 3.5.3 3.6.5 3.7.7 3.8.3 3.9.10 4.0.8 4.1.6 4.2.4 4.3.5 4.4.4 4.5.5 4.6.4 4.7.4 4.8.4 4.9.3; do
	out=typescript-$v.d.ts
	if ! [[ -f data/$out ]]; then
		curl -L https://unpkg.com/typescript@$v/lib/typescript.d.ts -o data/$out
	fi
done