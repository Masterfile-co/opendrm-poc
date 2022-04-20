variable DOMAIN {
  type = string 
}

variable IMAGETAG {
  type = string
}

job "opendrm-client" {
  region = "global"
  // TODO: Make dynamic
  datacenters = ["us-west-2a","us-west-2b","us-west-2c"]
  type        = "service"

	vault {
		policies = ["read-dev"]
		change_mode   = "signal"
		change_signal = "SIGUSR1"
	}

	update {
		max_parallel     = 2
		min_healthy_time = "30s"
		healthy_deadline = "5m"
		auto_revert = true
	}

  group "opendrm-client" {
    count = 1

    network {
     
      port "opendrm-client" {
        to = 3000
      }

    }

    service {
      name = "opendrm-client"
	  port = "opendrm-client"

	  tags = [
	    "traefik.enable=true",
		"traefik.http.routers.opendrmdemo.rule=Host(`opendrm-demo.${var.DOMAIN}`)",
	  ]

      check {
        name     = "alive"
        type     = "tcp"
        port     = "opendrm-client"
        path     = "/hello"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "opendrm-client" {

      driver = "docker"
	
	  config {
        image = "634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-client-${var.IMAGETAG}"
      }


      template {
        data = <<EOH
		{{ with secret "kv/masterfile/dev/opendrm-client" }}
			BOB_ADDRESS 					= "{{ .Data.data.BOB_ADDRESS }}"
			OPENDRM721_ADDRESS 				= "{{ .Data.data.OPENDRM721_ADDRESS }}"
			OPENDRM_COORDINATOR_ADDRESS 	= "{{ .Data.data.OPENDRM_COORDINATOR_ADDRESS }}"
		{{ end }}
        EOH

        destination = "local/file.env"
        env         = true
      }
        
	  env {
		  DKG_URL = "https://opendrm-server.${var.DOMAIN}"
	  }
    }
  }
}
