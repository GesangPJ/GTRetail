-- AddForeignKey
ALTER TABLE "DetailBermasalah" ADD CONSTRAINT "DetailBermasalah_pembelianbermasalahId_fkey" FOREIGN KEY ("pembelianbermasalahId") REFERENCES "PembelianBermasalah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KedatanganDetail" ADD CONSTRAINT "KedatanganDetail_kedatanganId_fkey" FOREIGN KEY ("kedatanganId") REFERENCES "Kedatangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
