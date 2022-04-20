variable DOMAIN {
  type = string 
}

variable IMAGETAG {
  type = string
}


job "opendrm-server" {
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

  group "opendrm-server" {
    count = 1

    network {
     
      port "opendrm-server" {
        to = 3001
      }

    }

    service {
      name = "opendrm-server"
	  port = "opendrm-server"

	  tags = [
	    "traefik.enable=true",
		"traefik.http.routers.opendrmserver.rule=Host(`opendrm-server.${var.DOMAIN}`)",
	  ]

      check {
        name     = "alive"
        type     = "tcp"
        port     = "opendrm-server"
        path     = "/healthcheck"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "opendrm-server" {

      driver = "docker"
	
	  config {
        image = "634967882344.dkr.ecr.us-west-2.amazonaws.com/dev:opendrm-server-${var.IMAGETAG}"
      }

      template {
        data = <<EOH
		{{ with secret "kv/masterfile/dev/opendrm-server" }}
			ALICE_NU_SECRET_KEY 	= "{{ .Data.data.ALICE_NU_SECRET_KEY }}"
			ALICE_PRIVATE_KEY 		= "{{ .Data.data.ALICE_PRIVATE_KEY }}"
			DKG_MANAGER_ADDRESS 	= "{{ .Data.data.DKG_MANAGER_ADDRESS }}"
			MUMBAI_URL 				= "{{ .Data.data.MUMBAI_URL }}"
			NETWORK 				= "{{ .Data.data.NETWORK }}"
		{{ end }}
        EOH

        destination = "local/file.env"
        env         = true
      }
    }
  }
}
