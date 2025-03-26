"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (trackingNumber: string, trackingUrl: string) => void;
}

export const ShippingDetailsDialog = ({ open, onClose, onConfirm }: Props) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const handleConfirm = () => {
    onConfirm(trackingNumber, trackingUrl);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>รายละเอียดจัดส่ง</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="หมายเลขพัสดุ"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Input placeholder="ลิงก์ติดตามพัสดุ" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
        </div>
        <DialogFooter className="space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            ปิด
          </Button>
          <Button onClick={handleConfirm}>ยืนยัน</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
